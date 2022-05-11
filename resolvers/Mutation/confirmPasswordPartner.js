const { ApolloError, UserInputError } = require("apollo-server-express");
const isEmail = require("isemail");
const config = require("config");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../../Utils/email");
const { restore } = require("../../Utils/email/Restore");

module.exports.confirmPasswordPartner = async (_, { email }, { dataSources }) => {
    try {
        if (!isEmail.validate(email))
            return new UserInputError("Неверный Email!", { argumentName: "email" });

        const partner = await dataSources.partnerAPI.findPartner({ email });

        if (!partner)
            return new UserInputError("Такого пользователя не существует!", {
                argumentName: "email",
            });

        const token = jwt.sign({ email }, config.get("jwtSecret"), {
            expiresIn: "1h",
        });

        const link = `https://partner.appinion.digital/password/reset/${token}`;
        const isSent = sendEmail(email, restore(email, link), "Сброс пароля");
        return isSent;
    } catch (e) {
        console.log(e);
        return new ApolloError("Ошибка сервера!");
    }
};
