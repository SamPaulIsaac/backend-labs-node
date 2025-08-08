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

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return sendResponse(res, 401, "Access token expired");
      }
      return sendResponse(res, 403, "Invalid token");
    }

    // Attach user info (including role) from token to request
    req.user = decoded;
    next();
  });
};
