const {
  ApolloError,
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const { isSiteOnline } = require("../../Utils");

module.exports.project = async (_, { form }, { user, dataSources }) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");

    const isOnline = await isSiteOnline(form.site);
    if (!isOnline) return new UserInputError("Данный сайт недоступен!");

    const project = await dataSources.projectAPI.createProject({
      ...form,
      userId: user._id,
    });

    await dataSources.userAPI.setCurrentProject(user._id, project._id);

    return project;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
