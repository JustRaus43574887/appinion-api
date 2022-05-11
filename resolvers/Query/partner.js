const { ApolloError } = require("apollo-server-express");

module.exports.partner = async (_, __, { partner, dataSources }) => {
    try {
        if (!partner) return;

        return partner;
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
