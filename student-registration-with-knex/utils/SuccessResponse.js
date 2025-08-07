// utils/SuccessResponse.js

class SuccessResponse {
  constructor(message = "Success", data = null) {
    this.message = message;
    this.data = data;
  }
}

module.exports = SuccessResponse;
