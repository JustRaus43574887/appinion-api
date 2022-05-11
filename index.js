const express = require("express");
const cors = require("cors");
const passport = require("passport");
const { ApolloServer } = require("apollo-server-express");
const { ExpressPeerServer } = require("peer");
const { graphqlUploadExpress } = require("graphql-upload");
const config = require("config");
const path = require("path");
require("./Utils").mongoConnect();
require("./Utils/passport-setup");

const mkdirp = require("mkdirp");
mkdirp.sync("./static/images");
mkdirp.sync("./static/videos");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { context, dataSources } = require("./Utils/apolloConfig");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  uploads: false,
});

const app = express();
const httpServer = require("http").createServer(app);
const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
  path: "/appinion",
});
const io = require("socket.io")(httpServer, {
  cors: "*",
});
require("./Utils/widgetChat")(io);

app.use("/peerjs", peerServer);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: false }));
app.use(
  "/static",
  express.static(path.join(__dirname, "static"), {
    setHeaders: function setHeaders(res, path, stat) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET");
      res.header("Access-Control-Allow-Headers", "Content-Type");
    },
  })
);
app.use(
  "/graphql",
  graphqlUploadExpress({
    maxFileSize: 500000000, // 50 MB
    maxFiles: 4,
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect(`https://admin.appinion.digital/auth/google/${req.user}`);
  }
);

server.applyMiddleware({ app, bodyParserConfig: { limit: "500mb" } });

const PORT = config.get("port");
httpServer.listen(PORT, () => {
  console.log(
    "🚀 Server ready at",
    `https://localhost:${PORT}${server.graphqlPath}`
  );
});
