const { ApolloError, AuthenticationError } = require("apollo-server-express");

module.exports.videoWidgets = async (
  _,
  { projectId },
  { user, dataSources }
) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");

    return await dataSources.videoWidgetAPI.getUserProjectVideoWidgets(
      user._id,
      projectId
    );
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
