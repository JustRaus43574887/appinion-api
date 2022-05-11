const { DataSource } = require("apollo-datasource");
const Partner = require("../models/Partner");
const isEmail = require("isemail");

class PartnerAPI extends DataSource {
    async createPartner(data) {
        const partner = new Partner(data);
        await partner.save();
        return partner;
    }

    async findPartner({ email }) {
        if (!isEmail.validate(email)) return;
        return await Partner.findOne({ email });
    }

    async findPartnerByPromocode({ promocode }) {
        return await Partner.findOne({ promocode });
    }

    async updatePartner(data) {
        return await Partner.findOneAndUpdate({ email: data.email }, data, {
            useFindAndModify: false,
            new: true
        });
    }

    async updatePartnerBalance(email, amount) {
        return Partner.findOneAndUpdate({ email }, { balance: amount }, {
            useFindAndModify: false,
            new: true
        })
    }

    async getAllPartners() {
        return await Partner.find();
    }
}

module.exports = PartnerAPI;
