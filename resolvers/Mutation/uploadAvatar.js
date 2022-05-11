const { ApolloError, AuthenticationError } = require("apollo-server-express");
const fs = require("fs");

module.exports.uploadAvatar = async (
  _,
  { avatar },
  { live, dataSources, storeUpload }
) => {
  try {
    if (!live) return new AuthenticationError("Не авторизован!");

    if (live.avatar) fs.unlinkSync("." + live.avatar.path);

    const file = await storeUpload(avatar, "images");
    if (!file) return new ApolloError("Ошибка загрузки аватарки!");

    const save = await dataSources.videoWidgetAPI.addAvatar(live.id, file);
    return !!save;
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
