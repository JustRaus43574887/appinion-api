const { login } = require("./login");
const { loginLive } = require("./loginLive");
const { logoutLive } = require("./logoutLive");
const { uploadAvatar } = require("./uploadAvatar");
const { addFcmToken } = require("./addFcmToken");
const { registration } = require("./registration");
const { logout } = require("./logout");
const { videoWidget } = require("./videoWidget");
const { project } = require("./project");
const { currentProject } = require("./currentProject");
const { deleteVideoWidget } = require("./deleteVideoWidget");
const { updateVideoWidget } = require("./updateVideoWidget");
const { restorePassword } = require("./restorePassword");
const { restorePasswordPartner } = require("./restorePasswordPartner");
const { confirmPassword } = require("./confirmPassword");
const { confirmPasswordPartner } = require("./confirmPasswordPartner");
const { dropPassword } = require("./dropPassword");
const { initPayment } = require("./initPayment");
const { updateTariff } = require("./updateTariff");
const { registrationPartner } = require("./registrationPartner");
const { loginPartner } = require("./loginPartner");
const { updatePartner } = require("./updatePartner");
const { updatePromocode } = require("./updatePromocode");

module.exports = {
  login,
  loginLive,
  logoutLive,
  uploadAvatar,
  addFcmToken,
  logout,
  registration,
  videoWidget,
  project,
  currentProject,
  deleteVideoWidget,
  updateVideoWidget,
  restorePassword,
  restorePasswordPartner,
  confirmPassword,
  confirmPasswordPartner,
  dropPassword,
  initPayment,
  updateTariff,
  registrationPartner,
  loginPartner,
  updatePartner,
  updatePromocode,
};
