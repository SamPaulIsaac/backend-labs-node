// middlewares/errorHandler.js

const EntityNotFoundError = require("../utils/EntityNotFoundError");
const sendResponse = require("../utils/sendResponse");

const errorHandler = (err, req, res, next) => {
  const status = err instanceof EntityNotFoundError ? err.status : 500;
  const message = err.message || "Internal Server Error";

  sendResponse(res, status, message);
};

module.exports = errorHandler;
