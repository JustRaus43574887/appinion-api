const { ApolloError } = require("apollo-server-express");

module.exports.users = async (_, __, { dataSources }) => {
    try {
        const data = [];
        const user = await dataSources.userAPI.getAllUsers();

        for (let i in user) {
            const payment = await dataSources.paymentAPI.userPaymentId(user[i]._id);

            const partner = await dataSources.partnerAPI.findPartnerByPromocode({
                promocode: user[i].promocode,
            });

            let amount = 0;

            if (payment.data.length !== 0) {

                for (let i in payment.data) {
                    let trigger = false;
                    for (let j in payment.data[i].feedbacks) {
                        if (payment.data[i].feedbacks[j].feedback.Status === 'CONFIRMED') {
                            trigger = true;
                        }
                    }
                    if (trigger) {
                        amount += payment.data[i].amount;
                    }
                }
            };

            const result = {
                user: user[i],
                tariff: await dataSources.tarifficationAPI.getTariff(user[i]._id),
                currentProject: await dataSources.projectAPI.getCurrentProject(
                    user[i].currrentProject
                ),
                payment: { amount },
                partnerInfo: partner && user[i].promocode === partner.promocode ? partner : null,
            };

            data.push(result);
        }

        return data;
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
