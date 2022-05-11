const { ApolloError, AuthenticationError } = require("apollo-server-express");

module.exports.updatePromocode = async (
  _,
  { promocode },
  { user, dataSources }
) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");
    const update = await dataSources.userAPI.updatePromocode(
      user._id,
      promocode
    );
    return !!update;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
