const { ApolloError } = require("apollo-server-express");

module.exports.userPaymentInfo = async (_, { id, page, limit, currentPage }, { dataSources }) => {
    try {
        const user = await dataSources.userAPI.findUserById(id);
        const partner = await dataSources.partnerAPI.findPartnerByPromocode({ promocode: user.promocode });
        const payment = await dataSources.paymentAPI.userPaymentId(user._id);
        const data = [];
        const userInfo = [];
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

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
        }

        for (let i in userInfo) {
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
                promocode: user.promocode,
                payment: allPayments[i],
                paymentDate: dates[i].created_at,
                partnerAccural: Math.ceil((userInfo[i].paymentValue ? userInfo[i].paymentValue : 0) * partner.partnerAccural / 100),
                discontSize: Math.ceil((allPayments[i] / (100 - partner.partnerAccural)) * partner.partnerAccural)
            };
            data.push(result);
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
