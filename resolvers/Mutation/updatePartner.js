const { ApolloError, AuthenticationError } = require("apollo-server-express");

module.exports.updatePartner = async (_, { form }, { user, dataSources }) => {
    try {
        if (!user) return new AuthenticationError("Не авторизован!");

        const {
            promocode,
            activated,
            partnerAccural,
            discontDuration,
            discontSize,
            referralAccural,
            balance
        } = form;

        const partner = await dataSources.partnerAPI.findPartner({email: form.email})

        const data = {
            email: partner.email,
            promocode: promocode ? promocode : partner.promocode,
            activated: activated ? activated : partner.activated,
            partnerAccural: partnerAccural ? partnerAccural : partner.partnerAccural,
            discontDuration: discontDuration ? discontDuration : partner.discontDuration,
            discontSize: discontSize ? discontSize : partner.discontSize,
            referralAccural: referralAccural ? referralAccural : partner.referralAccural,
            balance: balance ? balance : partner.balance,
        };

        const res = await dataSources.partnerAPI.updatePartner(data);

        return res;
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
