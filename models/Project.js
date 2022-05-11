const { Schema, model } = require("mongoose");

const schema = new Schema({
  userId: { type: String, required: true },
  site: { type: String, required: true },
  widgetType: { type: Number, required: true },
});

module.exports = model("Project", schema);
