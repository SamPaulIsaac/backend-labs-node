// middlewares/authenticate.js
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

module.exports = function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return sendResponse(res, 401, "Token not provided");
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return sendResponse(res, 403, "Invalid or expired token");
    }

    // Attach user info from token to request
    req.user = user;
    next();
  });
};
