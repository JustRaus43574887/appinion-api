const { ApolloError, AuthenticationError } = require("apollo-server-express");
const fs = require("fs");

module.exports.deleteVideoWidget = async (_, { id }, { user, dataSources }) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");
    const videoWidget = await dataSources.videoWidgetAPI.deleteVideoWidget(id);
    for (let i in videoWidget.videos)
      fs.unlinkSync("." + videoWidget.videos[i].path);
    return videoWidget;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
