const { UserInputError } = require("apollo-server-express");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports.verifyToken = async (_, { token }) => {
  if (token) {
    try {
      const { email } = jwt.verify(token, config.get("jwtSecret"));
      return { ok: true, email };
    } catch (e) {
      return new UserInputError("Ссылка устарела!", { argumentName: "token" });
    }
  } else {
    return new UserInputError("Нет токена!", { argumentName: "token" });
  }
};
