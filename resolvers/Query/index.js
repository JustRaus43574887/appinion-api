const { me } = require("./me");
const { live } = require("./live");
const { partner } = require("./partner");
const { partnerConnectedUsers } = require("./partnerConnectedUsers");
const { partners } = require("./partners");
const { users } = require("./users");
const { projects } = require("./projects");
const { videoWidgets } = require("./videoWidgets");
const { videoWidget } = require("./videoWidget");
const { verifyToken } = require("./verifyToken");
const { userPaymentInfo } = require("./userPaymentInfo");
const { usersPaymentsInfo } = require("./usersPaymentsInfo");

module.exports = {
  me,
  live,
  projects,
  videoWidgets,
  videoWidget,
  verifyToken,
  users,
  partner,
  partners,
  partnerConnectedUsers,
  userPaymentInfo,
  usersPaymentsInfo,
};
