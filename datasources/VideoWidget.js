const { DataSource } = require("apollo-datasource");
const Video = require("../models/widgets/Video");

class VideoWidgetAPI extends DataSource {
  async createVideoWidget(data) {
    const project = new Video(data);
    await project.save();
    return project;
  }

  async deleteVideoWidget(id) {
    return await Video.findByIdAndDelete(id, { useFindAndModify: false });
  }

  async updateVideoWidget(id, data) {
    return await Video.findByIdAndUpdate(id, data, {
      useFindAndModify: false,
      new: true,
    });
  }

  async getUserProjectVideoWidgets(userId, projectId) {
    return await Video.find({ userId, projectId });
  }

  async getVideoWidget(id) {
    return await Video.findById(id);
  }

  async getVideoWidgetByLogin(login) {
    return await Video.findOne({ login });
  }

  async addFcmToken(id, fcmToken) {
    return await Video.findByIdAndUpdate(
      id,
      { $push: { fcmToken } },
      {
        useFindAndModify: false,
        new: true,
      }
    );
  }

  async removeFcmToken(id, fcmToken) {
    return await Video.findByIdAndUpdate(
      id,
      { $pull: { fcmToken } },
      {
        useFindAndModify: false,
        new: true,
      }
    );
  }

  async addAvatar(id, avatar) {
    return await Video.findByIdAndUpdate(
      id,
      { avatar },
      {
        useFindAndModify: false,
        new: true,
      }
    );
  }
}

module.exports = VideoWidgetAPI;
