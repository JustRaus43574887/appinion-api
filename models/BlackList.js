const { Schema, model } = require("mongoose");

const schema = new Schema({
  token: { type: String, required: true, unique: true },
});

module.exports = model("BlackList", schema);
