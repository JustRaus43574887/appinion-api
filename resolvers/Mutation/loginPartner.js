const isEmail = require("isemail");
const { UserInputError, ApolloError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

module.exports.loginPartner = async (_, { form }, { dataSources }) => {
    try {
        const { email, password } = form;

        if (!isEmail.validate(email))
            return new UserInputError("Неверный Email!", { argumentName: "email" });

        const partner = await dataSources.partnerAPI.findPartner({
            email: email.toLowerCase(),
        });
        if (!partner)
            return new UserInputError("Такого пользователя не существует!", {
                argumentName: "email",
            });

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch)
            return new ApolloError("Неверный пароль", { argumentName: "password" });

        const token = jwt.sign({ partnerId: partner.id }, config.get("jwtSecret"), {});

        return {
            token,
            partner
        };
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
