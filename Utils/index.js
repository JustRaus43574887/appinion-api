const Mongoose = require("mongoose");
const config = require("config");
const fetch = require("node-fetch");

module.exports.mongoConnect = async () => {
  try {
    await Mongoose.connect(config.get("mongoString"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.log("Mongodb error", e.message);
    process.exit(1);
  }
};

module.exports.isSiteOnline = async (url) => {
  return new Promise((resolve) => {
    fetch(url)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
};
