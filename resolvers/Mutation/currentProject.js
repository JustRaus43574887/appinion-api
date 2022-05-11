const { ApolloError, AuthenticationError } = require("apollo-server-express");

module.exports.currentProject = async (_, { id }, { user, dataSources }) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");

    await dataSources.userAPI.setCurrentProject(user._id, id);
    return await dataSources.projectAPI.getCurrentProject(id);
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
