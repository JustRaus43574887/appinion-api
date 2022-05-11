const {
  ApolloError,
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const bcrypt = require("bcryptjs");

module.exports.dropPassword = async (
  _,
  { password, newPassword },
  { user, dataSources }
) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return new UserInputError("Неверный пароль", {
        argumentName: "password",
      });

    if (newPassword.length < 6)
      return new UserInputError("Слишком короткий пароль!", {
        argumentName: "newPassword",
      });

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatePassword = await dataSources.userAPI.dropPassword(
      user._id,
      hashedPassword
    );
    if (updatePassword) return true;
    else return false;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
