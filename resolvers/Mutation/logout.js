const { ApolloError } = require("apollo-server-express");

module.exports.logout = async (_, { token }, { dataSources }) => {
  try {
    const logout = await dataSources.userAPI.logoutUser({ token });
    if (logout) return true;
    return false;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
