const { ApolloError, AuthenticationError } = require("apollo-server-express");
const bcrypt = require("bcryptjs");

const UsernameGenerator = require("username-generator");
const passwordGenerator = require("generate-password");

const { sendEmail } = require("../../Utils/email");
const { Live } = require("../../Utils/email/Live");

module.exports.videoWidget = async (
  _,
  { form },
  { user, storeUpload, dataSources }
) => {
  try {
    if (!user) return new AuthenticationError("Не авторизован!");

    let videos = [];

    if (form.videos && form.videos.length !== 0) {
      const results = await Promise.allSettled(
        form.videos.map((video) => storeUpload(video, "videos"))
      );
      videos = results.reduce((storedFiles, { value, reason }) => {
        if (value) storedFiles.push(value);
        // Realistically you would do more than just log an error.
        else console.error(`Failed to store upload: ${reason}`);
        return storedFiles;
      }, []);
    }

    const login = UsernameGenerator.generateUsername();
    const password = passwordGenerator.generate();
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save to db
    const data = await dataSources.videoWidgetAPI.createVideoWidget({
      ...form,
      videos,
      userId: user._id,
      login,
      password: hashedPassword,
    });

    const result =
      form.type === 2
        ? await sendEmail(
            user.email,
            Live({ login, password }),
            "Виджет прямого эфира"
          )
        : true;
    if (data && result) return data;
    else throw new ApolloError("Ошибка сервера");
  } catch (e) {
    console.log(e);
    return new ApolloError("Ошибка сервера!");
  }
};
