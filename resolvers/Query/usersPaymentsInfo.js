const { ApolloError } = require("apollo-server-express");

module.exports.usersPaymentsInfo = async (_, { page, limit, currentPage }, { partner, dataSources }) => {
    try {
        const data = [];
        const users = await dataSources.userAPI.getAllUsers();
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        for (let i in users) {
            const payment = await dataSources.paymentAPI.userPaymentId(users[i]._id);

            const userInfo = [];

            if (payment.data.length !== 0) {

                for (let i in payment.data) {
                    let trigger = false;
                    for (let j in payment.data[i].feedbacks) {
                        if (payment.data[i].feedbacks[j].feedback.Status === 'CONFIRMED') {
                            trigger = true;
                        }
                    }
                    if (trigger) {
                        const description = JSON.parse(payment.data[i].description);

                        if (description[2] === partner.promocode) {
                            userInfo.push({ ...payment.data[i], paymentValue: description[3] })
                        }
                    }
                }
            };

            for (let i in userInfo) {
                const user = await dataSources.userAPI.findUserById(userInfo[i].userId);

                const allPayments = userInfo.map(u => {
                    if (u.userId === user.id) {
                        return u.amount;
                    }
                });

                const dates = userInfo.map(u => {
                    if (u.userId === user.id) {
                        return u.dates;
                    }
                });

                const result = {
                    user: user,
                    tariff: await dataSources.tarifficationAPI.getTariff(user._id),
                    partnerAccural: Math.ceil((userInfo[i].paymentValue ? userInfo[i].paymentValue : 0) * partner.partnerAccural / 100),
                    payment: allPayments[i],
                    paymentDate: dates[i].created_at,
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
        };
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
