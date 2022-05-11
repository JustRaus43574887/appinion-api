const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const config = require("config");
const User = require("../models/User");
const { sendEmail } = require("../Utils/email");
const { regHtml } = require("../Utils/email/Registration");
const TarrificationAPI = require("../datasources/tariffication");
const { tariffSevenHtml } = require("../Utils/email/TariffSeven");

passport.use(new GoogleStrategy({
    clientID: '551996620065-bcik3oa78f55sejv6e45sm8tn7bq42r2.apps.googleusercontent.com',
    clientSecret: '5lUjmbSkmLuPeD8opjCdY7VP',
    callbackURL: 'https://api.appinion.digital/auth/google/redirect'
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        let token = null;

        const condidate = await User.findOne({ email: profile._json.email });

        if (condidate) {
            token = jwt.sign({ userId: condidate.id }, config.get("jwtSecret"), {});
        } else {
            const user = new User({
                email: profile._json.email,
                name: profile._json.name,
                password: await bcrypt.hash(profile.id, 12)
            });

            await user.save();

            token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {});
            if (user) {
                sendEmail(profile._json.email, regHtml(profile._json.email), "Успешная регистрация");
                await new TarrificationAPI().createTariff(user.id);
                const date7 = new Date(Date.now() + 300000);
                const date3 = new Date(Date.now() + 600000);
                const date1 = new Date(Date.now() + 900000);
                schedule.scheduleJob("email-send", date7, () => {
                    sendEmail(
                        profile._json.email,
                        tariffSevenHtml(profile._json.email, "7 дней"),
                        "Напоминаем о балансе"
                    );
                });
                schedule.scheduleJob("email-send", date3, () => {
                    sendEmail(
                        profile._json.email,
                        tariffSevenHtml(profile._json.email, "3 дня"),
                        "Напоминаем о балансе"
                    );
                });
                schedule.scheduleJob("email-send", date1, () => {
                    sendEmail(
                        profile._json.email,
                        tariffSevenHtml(profile._json.email, "1 день"),
                        "Напоминаем о балансе"
                    );
                });
            }
        }
        return done(null, token);
    }
    catch (e) {
        console.log(e)
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
