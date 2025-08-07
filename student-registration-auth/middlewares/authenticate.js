const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return sendResponse(res, 401, "Token not provided");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return sendResponse(res, 403, "Invalid token");
    req.user = user;
    next();
  });
};
