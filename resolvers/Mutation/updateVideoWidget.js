const { ApolloError, AuthenticationError } = require("apollo-server-express");
const fs = require("fs");
const Video = require("../../models/widgets/Video");

module.exports.updateVideoWidget = async (
  _,
  { id, form },
  { user, storeUpload, dataSources, live }
) => {
  try {
    if (!user && !live) return new AuthenticationError("Не авторизован!");

    const videoWidget = await Video.findById(id);
    let videos = [];

    for (let i in videoWidget.videos)
      fs.unlinkSync("." + videoWidget.videos[i].path);

    if (form.videos && form.videos.length !== 0) {
      const results = await Promise.allSettled(
        form.videos.map((video) => storeUpload(video, "videos"))
      );
      videos = results.reduce((storedFiles, { value, reason }) => {
        if (value) storedFiles.push(value);
        // Realistically you would do more than just log an error.
        else console.error(`Failed to store upload: ${reason}`);
        return storedFiles;
      }, []);
    }

    return await dataSources.videoWidgetAPI.updateVideoWidget(id, {
      ...form,
      videos,
    });
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
