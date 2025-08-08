// middlewares/authorize.js
const sendResponse = require("../utils/sendResponse");

module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendResponse(res, 403, "Forbidden: insufficient permissions");
    }
    next();
  };
};
