const { ApolloError } = require("apollo-server-express");

module.exports.videoWidget = async (_, { id }, { dataSources }) => {
  try {
    const videoWidget = await dataSources.videoWidgetAPI.getVideoWidget(id);
    const userTariff = await dataSources.tarifficationAPI.getTariff(videoWidget.userId);

    return { ...videoWidget._doc, tariffType: userTariff.type };
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
