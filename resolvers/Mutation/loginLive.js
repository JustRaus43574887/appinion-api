const { UserInputError, ApolloError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

module.exports.loginLive = async (_, { form }, { dataSources }) => {
  try {
    const { login, password, fcmToken } = form;

    const liveWidget = await dataSources.videoWidgetAPI.getVideoWidgetByLogin(
      login
    );

    if (!liveWidget)
      return new UserInputError("Такого пользователя не существует!", {
        argumentName: "login",
      });

    const addToken = await dataSources.videoWidgetAPI.addFcmToken(
      liveWidget._id,
      fcmToken
    );

    if (!addToken) throw new UserInputError("Ошибка получения токена!");

    const isMatch = await bcrypt.compare(password, liveWidget.password);
    if (!isMatch)
      return new ApolloError("Неверный пароль", { argumentName: "password" });

    const token = jwt.sign(
      { liveId: liveWidget.id },
      config.get("jwtSecret"),
      {}
    );

    return token;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
