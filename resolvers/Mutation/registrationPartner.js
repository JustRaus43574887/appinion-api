const { ApolloError, UserInputError } = require("apollo-server-express");
const bcrypt = require("bcryptjs");
const isEmail = require("isemail");
const shortid = require("shortid");

module.exports.registrationPartner = async (_, { form }, { dataSources }) => {
    try {
        const { name, email, password, nameOfOrganization, inn } = form;

        if (!isEmail.validate(email))
            return new UserInputError("Неверный email!", { argumentName: "email" });

        if (password.length < 6)
            return new UserInputError("Слишком короткий пароль!", {
                argumentName: "password",
            });

        const candidate = await dataSources.partnerAPI.findPartner({
            email: email.toLowerCase(),
        });
        if (candidate)
            return new UserInputError("Пользователь уже существует!", {
                argumentName: "email",
            });

        const hashedPassword = await bcrypt.hash(password, 12);
        const partner = await dataSources.partnerAPI.createPartner({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            nameOfOrganization,
            inn
        });

        if (partner) {
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
