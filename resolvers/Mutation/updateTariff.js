const { ApolloError, AuthenticationError } = require("apollo-server-express");

module.exports.updateTariff = async (_, __, { user, dataSources }) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");

    const tariff = await dataSources.tarifficationAPI.getTariff(user.id);

    const timeDiffOfExpiredAndPay = Math.abs(new Date(parseInt(tariff.expired, 10)).getTime() - new Date(tariff.createdAt).getTime());
    const timeDiffOfCreatedAndToday = Math.ceil(new Date().getTime() - new Date(tariff.createdAt).getTime());

    const lastDays = timeDiffOfExpiredAndPay - timeDiffOfCreatedAndToday;


    const date = Math.floor(Math.ceil(lastDays / 86400000) * (23 / 33)) * 86400000 + Date.now();

    const result = await dataSources.tarifficationAPI.upgrateTariff(user.id, date);
    if (result) return true;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
