const Video = require("../models/widgets/Video");
const admin = require("firebase-admin");

const credential = require("../mobile-appinion-firebase-sdk.json");
admin.initializeApp({
  credential: admin.credential.cert(credential),
});

module.exports.sendNotification = (
  host,
  email,
  text = "Запрос на видеоконсультацию! Время ожидания - 2 минуты.",
  data = {}
) => {
  try {
    Video.findOne({ host }, {}, (error, doc) => {
      if (error) return;
      if (!doc.fcmToken.length) return;
      admin.messaging().sendToDevice(
        doc.fcmToken,
        {
          notification: {
            title: email,
            body: text,
          },
          data,
        },
        { contentAvailable: true, priority: "high" }
      );
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.archiveChat = async (chat, host) => {
  try {
    return await Video.findOneAndUpdate(
      { host },
      {
        $push: {
          archive: {
            ...chat,
            time: this.getTime(),
          },
        },
      },
      { new: true, useFindAndModify: false }
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports.getArchives = async (host) => {
  try {
    const video = await Video.findOne({ host });
    return video.archive;
  } catch (e) {
    console.log(e);
  }
};

module.exports.deleteArchive = async (element, host) => {
  try {
    const video = await Video.findOneAndUpdate(
      { host },
      {
        $pullAll: { archive: [element] },
      },
      { new: true, useFindAndModify: false }
    );
    return video.archive;
  } catch (e) {
    console.log(e);
  }
};

module.exports.getTime = () => {
  var d = new Date();
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  var nd = new Date(utc + 3600000 * 3);
  return nd.toLocaleString("RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
