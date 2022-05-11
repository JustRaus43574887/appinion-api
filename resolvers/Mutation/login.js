const isEmail = require("isemail");
const { UserInputError, ApolloError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

module.exports.login = async (_, { form }, { dataSources }) => {
  try {
    const { email, password } = form;

    if (!isEmail.validate(email))
      return new UserInputError("Неверный Email!", { argumentName: "email" });

    const user = await dataSources.userAPI.findUser({
      email: email.toLowerCase(),
    });
    if (!user)
      return new UserInputError("Такого пользователя не существует!", {
        argumentName: "email",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return new ApolloError("Неверный пароль", { argumentName: "password" });

    const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {});

    const currentProject = await dataSources.projectAPI.getCurrentProject(
      user.currrentProject
    );

    return {
      token,
      me: {
        user,
        currentProject,
      },
    };
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
