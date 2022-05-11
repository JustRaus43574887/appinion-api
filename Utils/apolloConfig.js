const config = require("config");
const { createWriteStream, unlink } = require("fs");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlackList = require("../models/BlackList");
const Partner = require("../models/Partner");
const Video = require("../models/widgets/Video");

const UserAPI = require("../datasources/user");
const VideoWidgetAPI = require("../datasources/VideoWidget");
const ProjectAPI = require("../datasources/project");
const PaymentAPI = require("../datasources/payment");
const TarifficationAPI = require("../datasources/tariffication");
const PartnerAPI = require("../datasources/partner");

module.exports.dataSources = () => ({
  userAPI: new UserAPI(),
  projectAPI: new ProjectAPI(),
  videoWidgetAPI: new VideoWidgetAPI(),
  paymentAPI: new PaymentAPI(),
  tarifficationAPI: new TarifficationAPI(),
  partnerAPI: new PartnerAPI(),
});

module.exports.context = async ({ req, res }) => {
  const auth = (req.headers && req.headers.authorization) || "";
  if (auth.length === 0) return { user: null, partner: null };
  try {
    const blackToken = await BlackList.findOne({ token: auth });
    if (blackToken) throw new Error();
    const { userId } = jwt.verify(auth, config.get("jwtSecret"));
    const { partnerId } = jwt.verify(auth, config.get("jwtSecret"));
    const { liveId } = jwt.verify(auth, config.get("jwtSecret"));
    const user = await User.findOne({ _id: userId });
    const partner = await Partner.findOne({ _id: partnerId });
    const live = await Video.findOne({ _id: liveId });
    return { user, partner, live, storeUpload };
  } catch (e) {
    res.set("auth", "jwt expired");
  }
};

const storeUpload = async (upload, dirname) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const id = shortid.generate();
  const path = `./static/${dirname}/${id}-${filename}`;
  const file = {
    id,
    filename,
    mimetype,
    path: path.substring(1),
  };

  await new Promise((resolve, reject) => {
    const writeStream = createWriteStream(path);
    writeStream.on("finish", resolve);
    writeStream.on("error", (error) => {
      unlink(path, () => {
        reject(error);
      });
    });

    stream.on("error", (error) => writeStream.destroy(error));
    stream.pipe(writeStream);
  });

  return file;
};
