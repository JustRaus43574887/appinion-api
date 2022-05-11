const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    projectId: { type: String, required: true },
    userId: { type: String, required: true },
    type: { type: Number, required: true },
    location: { type: Array, required: true },
    staButton: { type: Boolean, required: true },
    staText: { type: String, required: false },
    staLink: { type: String, required: false },
    name: { type: String, required: false },
    position: { type: String, required: false },
    mainColor: { type: String, required: true },
    textColor: { type: String, required: false },
    utmLabel: { type: String, required: false },
    videos: { type: Array, required: false },
    online: { type: Boolean, required: false, default: true },
    host: { type: String, required: false },
    login: { type: String, required: false },
    password: { type: String, required: false },
    fcmToken: { type: Array, required: false },
    archive: { type: Array, required: false },
    avatar: { type: Object, required: false },
  },
  { timestamps: true }
);

module.exports = model("Video", schema);
