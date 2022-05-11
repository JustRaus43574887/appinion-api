const { ApolloError, AuthenticationError } = require("apollo-server-express");

module.exports.projects = async (_, __, { user, dataSources }) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");
    return await dataSources.projectAPI.getUserProjects(user._id);
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
