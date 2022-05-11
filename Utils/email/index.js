const config = require("config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(config.get("emailing"));

module.exports.sendEmail = async (email, html, subject) => {
  try {
    await transporter.sendMail({
      from: "no-reply@appinion.digital",
      to: email,
      subject,
      html,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
