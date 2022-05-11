const { DataSource } = require("apollo-datasource");
const isEmail = require("isemail");
const User = require("../models/User");
const BlackList = require("../models/BlackList");

class UserAPI extends DataSource {
  async createUser(data) {
    const user = new User(data);
    await user.save();
    return user;
  }

  async findUser({ email }) {
    if (!isEmail.validate(email)) return;
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async updateUser(data) {
    return await User.findOneAndUpdate({ _id: data._id }, data, {
      new: true,
      useFindAndModify: false,
    });
  }

  async logoutUser({ token }) {
    const blackToken = new BlackList({ token });
    await blackToken.save();
    return blackToken;
  }

  async setCurrentProject(id, projectId) {
    await User.findByIdAndUpdate(
      id,
      { currrentProject: projectId },
      { useFindAndModify: false }
    );
  }

  async getAllUsers() {
    return await User.find();
  }

  async dropPassword(id, password) {
    return await User.findByIdAndUpdate(
      id,
      { password },
      { useFindAndModify: true, new: true }
    );
  }

  async updatePromocode(id, promocode) {
    return await User.findByIdAndUpdate(
      id,
      { promocode },
      { useFindAndModify: true, new: true }
    );
  }
}

module.exports = UserAPI;
