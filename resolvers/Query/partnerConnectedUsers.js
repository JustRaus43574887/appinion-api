const { ApolloError } = require("apollo-server-express");

module.exports.partnerConnectedUsers = async (_, { page, limit, currentPage }, { partner, dataSources }) => {
    try {
        const data = [];
        const user = await dataSources.userAPI.getAllUsers();
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        for (let i in user) {
            const payment = await dataSources.paymentAPI.userPaymentId(user[i]._id);

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

            if (user[i].promocode === partner.promocode) {
                const result = {
                    user: user[i],
                    tariff: await dataSources.tarifficationAPI.getTariff(user[i]._id),
                    currentProject: await dataSources.projectAPI.getCurrentProject(
                        user[i].currrentProject
                    ),
                    payment: { amount }
                };
                data.push(result);
            }
        }

        const portionsUsers = data.slice(startIndex, endIndex);
        const totalUsersCount = data.length;

        return {
            users: portionsUsers,
            totalUsersCount,
            currentPage
        }
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
