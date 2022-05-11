const users = {};

const {
  sendNotification,
  archiveChat,
  getArchives,
  deleteArchive,
  getTime,
} = require("./chatFunctions");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("user", (user) => {
      try {
        socket.join(user.id);
        const userData = {
          ...user,
          socketId: socket.id,
          seen: false,
          time: getTime(),
        };

        if (Array.isArray(users[user.host])) users[user.host].push(userData);
        else users[user.host] = [userData];
        sendNotification(user.host, user.email);
        io.sockets.in(user.host).emit("users", users[user.host]);
      } catch (e) {
        console.error(e);
      }
    });

    socket.on("manager", (host) => {
      socket.join(host);
    });

    socket.on("users", (host) => {
      socket.emit("users", users[host] || []);
    });

    socket.on("getsession", ({ id, host }) => {
      socket.join(id);
      if (!users[host]) return;
      const index = users[host].findIndex((user) => user.id === id);
      if (index !== -1) {
        users[host][index].socketId = socket.id;
        socket.emit("getsession", users[host][index]);
      }
    });

    socket.on("archive", async (id, host) => {
      if (!users[host]) return;
      const index = users[host].findIndex((user) => user.id === id);
      if (index !== -1) {
        const archiveated = await archiveChat(users[host][index], host);
        if (archiveated) {
          users[host].splice(index, 1);
          socket.emit("archive");
        }
      }
    });

    socket.on("archives", async (host) => {
      const archives = await getArchives(host);
      if (archives) socket.emit("archives", archives);
    });

    socket.on("deleteArchive", async (element, host) => {
      const del = await deleteArchive(element, host);
      if (del) socket.emit("deleteArchive");
    });

    socket.on("join", (id, host) => {
      socket.join(id);
      if (!users[host]) return;
      const index = users[host].findIndex((user) => user.id === id);
      if (index !== -1) {
        if (users[host][index].seen === false) {
          users[host][index].seen = true;
          socket.emit("users", users[host]);
          const mess = { type: "join" };
          if (users[host][index].messages)
            users[host][index].messages.push(mess);
          else users[host][index].messages = [mess];
          io.sockets.in(id).emit("message", mess);
        }
      }
    });

    socket.on("leave", (id) => {
      socket.leave(id);
    });

    socket.on("message", (message, id, host) => {
      const mess = {
        ...message,
        time: getTime(),
      };
      if (!users[host]) return;
      const index = users[host].findIndex((user) => user.id === id);
      if (index === -1) return;
      if (users[host][index].messages) users[host][index].messages.push(mess);
      else users[host][index].messages = [mess];
      if (message.from === "user")
        sendNotification(host, users[host][index].email, message.text, {
          item: JSON.stringify(users[host][index]),
        });
      io.sockets.in(id).emit("message", mess);
    });

    socket.on("messages", (id, host) => {
      if (!users[host]) return;
      const index = users[host].findIndex((user) => user.id === id);
      if (index !== -1)
        socket.emit("messages", users[host][index].messages || []);
    });

    socket.on("offer", (id, host) => {
      if (!users[host]) return;
      const index = users[host].findIndex((user) => user.id === id);
      if (index === -1) return;
      io.sockets.in(id).emit("offer");
      const mess = { type: "live-start" };
      if (users[host][index].messages) users[host][index].messages.push(mess);
      else users[host][index].messages = [mess];
      io.sockets.in(id).emit("message", mess);
    });

    socket.on("answer", (id) => {
      io.sockets.in(id).emit("answer", id);
    });

    socket.on("endcall", (id, host) => {
      if (!users[host]) return;
      const index = users[host].findIndex((user) => user.id === id);
      if (index === -1) return;
      if (![users[host][index].messages]) return;
      const messIndex = users[host][index].messages.findIndex(
        (message) => message.type === "live-start"
      );
      if (messIndex && messIndex !== -1) {
        users[host][index].messages.splice(messIndex, 1);
      }
      if (users[host][index].messages)
        users[host][index].messages.push({ type: "live-end" });
      else users[host][index].messages = [{ type: "live-end" }];
      io.sockets.in(id).emit("endcall", id, host);
    });

    socket.on("endsession", () => {
      for (const [key, _] of Object.entries(users)) {
        const index = users[key].findIndex(
          (user) => user.socketId === socket.id
        );
        if (index !== -1) {
          io.sockets
            .in(users[key][index].id)
            .emit("message", { type: "leave" });
          users[key].splice(index, 1);
        }
        socket.to(key).emit("users", users[key]);
      }
    });

    socket.on("disconnect", () => {});
  });
};
