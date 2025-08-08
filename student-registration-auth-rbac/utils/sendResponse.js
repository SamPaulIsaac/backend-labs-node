// utils/sendResponse.js

const logger = require("./logger");
const SuccessResponse = require("./SuccessResponse");

module.exports = function sendResponse(res, status, message, data = null) {
  const isError = status >= 400;
  const logPayload = { details: data };

  if (status >= 500) {
    logger.error(`Response ${status}: ${message}`, logPayload);
  } else if (status >= 400) {
    logger.warn(`Response ${status}: ${message}`, logPayload);
  } else {
    logger.info(`Response ${status}: ${message}`);
  }

  if (isError) {
    return res.status(status).json({
      message,
      ...(data ? { details: data } : {}),
    });
  }

  return res.status(status).json(new SuccessResponse(message, data));
};
