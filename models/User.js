const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },
  currrentProject: { type: String, required: false },
  promocode: { type: String, required: false },
},
  { timestamps: true });

module.exports = model("User", schema);
