const { ApolloError } = require("apollo-server-express");

module.exports.partners = async (_, __, { dataSources }) => {
    try {
        const data = [];
        const partner = await dataSources.partnerAPI.getAllPartners();

        for (let i in partner) {
            const result = partner[i];
            data.push(result);
        }

        return data;
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
