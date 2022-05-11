const { ApolloError } = require("apollo-server-errors");

module.exports.addFcmToken = async (_, { fcmToken }, { dataSources, live }) => {
  try {
    const addToken = await dataSources.videoWidgetAPI.addFcmToken(
      live.id,
      fcmToken
    );
    return !!addToken;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
