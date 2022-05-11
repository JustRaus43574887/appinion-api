const { DataSource } = require("apollo-datasource");
const Tariff = require("../models/Tariff");

class TarifficationAPI extends DataSource {
  async createTariff(userId) {
    const date = new Date(Date.now() + 12096e5); //12096e5
    const tariff = new Tariff({
      userId,
      type: 2,
      trial: true,
      expired: date,
      balance: 0,
    });
    await tariff.save();
  }

  async getTariff(userId) {
    return await Tariff.findOne({ userId });
  }

  async updateTariff(data) {
    return await Tariff.findOneAndUpdate(
      { userId: data.userId },
      { ...data },
      {
        useFindAndModify: false,
        new: true,
      }
    );
  }

  async upgrateTariff(userId, date) {
    return await Tariff.findOneAndUpdate(
      { userId },
      {
        type: 2,
        expired: date,
        upgrated: true,
      },
      { useFindAndModify: false, new: true }
    );
  }
}

module.exports = TarifficationAPI;
