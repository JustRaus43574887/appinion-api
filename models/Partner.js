const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nameOfOrganization: { type: String, required: false },
    inn: { type: String, required: false },
    promocode: { type: String, required: true, default: 'false' },
    activated: { type: Boolean, required: true, default: false },
    partnerAccural: { type: Number, required: true, default: 0 },
    discontDuration: { type: Date, required: true, default: Date.now },
    discontSize: { type: Number, required: true, default: 0 },
    referralAccural: { type: Number, required: true, default: 0 },
    balance: { type: Number, required: true, default: 0 }
},
    { timestamps: true });

module.exports = model("Partner", schema);