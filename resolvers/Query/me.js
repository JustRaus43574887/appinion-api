const { ApolloError } = require("apollo-server-express");
const { sendEmail } = require("../../Utils/email");
const schedule = require("node-schedule");
const { tariffSevenHtml } = require("../../Utils/email/TariffSeven");
const { expiredHtml } = require("../../Utils/email/Expired");

module.exports.me = async (_, __, { user, dataSources }) => {
  try {
    if (!user) return;

    const currentProject = await dataSources.projectAPI.getCurrentProject(
      user.currrentProject
    );

    const { data } = await dataSources.paymentAPI.userPaymentId(user.id);

    let tariff = await dataSources.tarifficationAPI.getTariff(user.id);

    const timeDiffOfExpiredAndPay = Math.abs(
      new Date(parseInt(tariff.expired, 10)).getTime() -
      new Date(tariff.createdAt).getTime()
    );
    const timeDiffOfCreatedAndToday = Math.ceil(
      new Date().getTime() - new Date(tariff.createdAt).getTime()
    );

    const diffDaysOfExpiredAndPay = Math.ceil(
      timeDiffOfExpiredAndPay / (1000 * 3600 * 24)
    );

    const lastDays =
      tariff.expired === 0
        ? 0
        : timeDiffOfExpiredAndPay - timeDiffOfCreatedAndToday;

    if (data.length !== 0) {
      const payment = data[data.length - 1];
      const lastFeedback = payment.feedbacks[payment.feedbacks.length - 1];

      if (
        lastFeedback.feedback.Status === "CONFIRMED" &&
        payment.id !== tariff.paymentId
      ) {
        let dateYear = Date.now() + 365 * 86400000; //365 * 86400000
        let dateMonth = Date.now() + 30 * 86400000; //30 * 86400000
        let restOfBalance = 0;
        const description = JSON.parse(payment.description);

        if (tariff.trial && description[0] === 2) {
          dateYear += lastDays;
          dateMonth += lastDays;
        }

        if (!tariff.trial) {
          const payPerDay = tariff.balance / diffDaysOfExpiredAndPay;
          restOfBalance =
            tariff.balance -
            Math.floor(timeDiffOfCreatedAndToday / (1000 * 3600 * 24)) *
            Math.ceil(payPerDay);
          dateYear += lastDays;
          dateMonth += lastDays;
        }

        if (tariff.trial && description[0] === 1) {
          dateYear +=
            Math.floor(Math.ceil(lastDays / 86400000) * (26.4 / 18.4)) *
            86400000;
          dateMonth +=
            Math.floor(Math.ceil(lastDays / 86400000) * (33 / 23)) * 86400000;
        }

        const expired = description[1] === 0 ? dateYear : dateMonth;

        tariff = await dataSources.tarifficationAPI.updateTariff({
          ...tariff._doc,
          trial: false,
          type: description[0],
          expired,
          balance: payment.amount + restOfBalance,
          paymentId: payment.id,
        });

        for (const job in schedule.scheduledJobs) schedule.cancelJob(job);

        const date7 = new Date(expired - 7 * 86400000);
        const date3 = new Date(Date.now() - 3 * 86400000);
        const date1 = new Date(Date.now() - 1 * 86400000);
        schedule.scheduleJob("email-send", date7, () => {
          sendEmail(
            user.email,
            tariffSevenHtml(user.email, "7 дней"),
            "Напоминаем о балансе"
          );
        });
        schedule.scheduleJob("email-send", date3, () => {
          sendEmail(
            user.email,
            tariffSevenHtml(user.email, "3 дня"),
            "Напоминаем о балансе"
          );
        });
        schedule.scheduleJob("email-send", date1, () => {
          sendEmail(
            user.email,
            tariffSevenHtml(user.email, "1 день"),
            "Напоминаем о балансе"
          );
        });
      }
    }

    if (tariff.expired <= Date.now() && tariff.type !== 0) {
      sendEmail(
        user.email,
        expiredHtml(user.email, tariff.type === 1 ? "медиум" : "бизнес"),
        "Тариф истек"
      );

      tariff = await dataSources.tarifficationAPI.updateTariff({
        ...tariff._doc,
        trial: false,
        type: 0,
        expired: 0,
        balance: 0,
        upgrated: false,
      });
    }

    const partner = await dataSources.partnerAPI.findPartnerByPromocode({
      promocode: user.promocode,
    });
    let discont = null;

    discont = partner && partner.discontSize;

    return {
      user: { ...user._doc, id: user._id, discont },
      currentProject,
      tariff,
    };
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
