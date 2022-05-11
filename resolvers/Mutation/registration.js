const { ApolloError, UserInputError } = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const isEmail = require("isemail");
const { sendEmail } = require("../../Utils/email");
const { regHtml } = require("../../Utils/email/Registration");
const { registratedHtml } = require("../../Utils/email/Registrated");
const schedule = require("node-schedule");
const { tariffSevenHtml } = require("../../Utils/email/TariffSeven");

module.exports.registration = async (_, { form }, { dataSources }) => {
  try {
    const { name, email, password, promocode } = form;

    if (!isEmail.validate(email))
      return new UserInputError("Неверный email!", { argumentName: "email" });

    if (password.length < 6)
      return new UserInputError("Слишком короткий пароль!", {
        argumentName: "password",
      });

    const candidate = await dataSources.userAPI.findUser({
      email: email.toLowerCase(),
    });
    if (candidate)
      return new UserInputError("Пользователь уже существует!", {
        argumentName: "email",
      });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await dataSources.userAPI.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      promocode,
    });

    if (user) {
      sendEmail(email, regHtml(email), "Успешная регистрация");
      sendEmail(
        "RagozynVadim@yandex.ru",
        registratedHtml({ email, name, promocode }),
        "Пользователь зарегистировался!"
      );
      await dataSources.tarifficationAPI.createTariff(user._id);
      const date7 = new Date(Date.now() + 300000);
      const date3 = new Date(Date.now() + 600000);
      const date1 = new Date(Date.now() + 900000);
      schedule.scheduleJob("email-send", date7, () => {
        sendEmail(
          email,
          tariffSevenHtml(email, "7 дней"),
          "Напоминаем о балансе"
        );
      });
      schedule.scheduleJob("email-send", date3, () => {
        sendEmail(
          email,
          tariffSevenHtml(email, "3 дня"),
          "Напоминаем о балансе"
        );
      });
      schedule.scheduleJob("email-send", date1, () => {
        sendEmail(
          email,
          tariffSevenHtml(email, "1 день"),
          "Напоминаем о балансе"
        );
      });

      return "Пользователь создан!";
    } else
      return new UserInputError("Ошибка создания пользователя!", {
        argumentName: "db",
      });
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
