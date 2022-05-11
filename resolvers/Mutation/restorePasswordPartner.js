const { ApolloError, UserInputError } = require("apollo-server-express");
const isEmail = require("isemail");
const Partner = require("../../models/Partner");
const bcrypt = require("bcryptjs");

module.exports.restorePasswordPartner = async (_, { email, password }) => {
    try {
        if (password.length < 6)
            return new UserInputError("Слишком короткий пароль!", {
                argumentName: "password",
            });

        if (!isEmail.validate(email))
            return new UserInputError("Неверный email!", { argumentName: "email" });

        const hashedPassword = await bcrypt.hash(password, 12);
        await Partner.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { useFindAndModify: false }
        );
        return true;
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
