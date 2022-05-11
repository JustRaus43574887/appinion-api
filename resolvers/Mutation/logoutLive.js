const { ApolloError } = require("apollo-server-errors");

module.exports.logoutLive = async (_, { fcmToken }, { dataSources, live }) => {
  try {
    const removeToken = await dataSources.videoWidgetAPI.removeFcmToken(
      live.id,
      fcmToken
    );
    return !!removeToken;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
