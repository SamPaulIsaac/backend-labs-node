// middlewares/errorHandler.js
const EntityNotFoundError = require("../utils/EntityNotFoundError");
const ValidationError = require("../utils/ValidationError");
const sendResponse = require("../utils/sendResponse");

const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof EntityNotFoundError) {
    status = err.status || 404;
    message = err.message;
  } else if (err instanceof ValidationError) {
    status = err.status || 400;
    message = err.message;
  } else if (process.env.NODE_ENV === "development") {
    // In dev mode, surface real error for debugging
    message = err.message || message;
  }

  // Log full error details (without leaking to user)
  console.error(err);

  sendResponse(res, status, message);
};

module.exports = errorHandler;
