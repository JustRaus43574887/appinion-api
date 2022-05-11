const { RESTDataSource } = require("apollo-datasource-rest");
const FormData = require("form-data");

class PaymentAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://pay.appinion.digital/api/payment/";
  }

  async initPayment(userId, amount, description) {
    const formdata = new FormData();
    formdata.append("user_id", userId);
    formdata.append("amount", amount);
    if (description) formdata.append("description", description);

    const response = await this.post("init", formdata);
    return response.data.url;
  }

  async paymentInfo(paymentId) {
    return await this.get(`info/${paymentId}`);
  }

  async userPaymentId(userId) {
    return await this.get(`all/${userId}`);
  }
}

module.exports = PaymentAPI;
