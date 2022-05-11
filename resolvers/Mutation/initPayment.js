const { ApolloError } = require("apollo-server-express");

module.exports.initPayment = async (_, { form }, { dataSources }) => {
  try {
    const { userId, amount, description } = form;

    const user = await dataSources.userAPI.findUserById(userId);

    if (user) {
      const partner = await dataSources.partnerAPI.findPartnerByPromocode({ promocode: user.promocode });

      if (new Date(partner.discontDuration) > new Date()) {
        await dataSources.partnerAPI.updatePartnerBalance(partner.email, partner.balance + Math.ceil(amount * (partner.partnerAccural / 100)));
      }
    }

    return await dataSources.paymentAPI.initPayment(
      userId,
      amount,
      description
    );
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
