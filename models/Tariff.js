const { Schema, model } = require("mongoose");

const schema = new Schema({
  userId: { type: String, required: true, unique: true },
  type: { type: Number, required: true },
  trial: { type: Boolean, require: true },
  expired: { type: Number, require: true },
  balance: { type: Number, require: true },
  upgrated: { type: Boolean, required: false },
  paymentId: { type: Number, required: false },
},
  { timestamps: true });

module.exports = model("Tariff", schema);
