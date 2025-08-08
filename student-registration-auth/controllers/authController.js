// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require("../db/knex");
const sendResponse = require("../utils/sendResponse");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "JWT_SECRET and REFRESH_SECRET must be set in environment variables"
  );
}

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return sendResponse(res, 400, "Username and password are required");
    }

    // Check if user already exists
    const existingUser = await knex("users").where({ username }).first();
    if (existingUser) {
      return sendResponse(res, 400, "Username already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [user] = await knex("users")
      .insert({ username: username.trim(), password: hashedPassword })
      .returning(["id", "username"]);

    sendResponse(res, 201, "User registered successfully", user);
  } catch (err) {
    sendResponse(res, 500, "Registration failed");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return sendResponse(res, 400, "Username and password are required");
    }

    const user = await knex("users").where({ username }).first();
    if (!user) return sendResponse(res, 401, "Invalid username or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendResponse(res, 401, "Invalid username or password");

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await knex("refresh_tokens").insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    sendResponse(res, 200, "Login successful", {
      accessToken,
      refreshToken,
    });
  } catch (err) {
    sendResponse(res, 500, "Login failed");
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendResponse(res, 401, "Refresh token required");

    const storedToken = await knex("refresh_tokens")
      .where({ token: refreshToken })
      .first();
    if (!storedToken) return sendResponse(res, 403, "Invalid refresh token");

    jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
      if (err)
        return sendResponse(res, 403, "Invalid or expired refresh token");

      // Rotate refresh token
      const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, {
        expiresIn: "7d",
      });

      await knex("refresh_tokens")
        .where({ token: refreshToken })
        .update({
          token: newRefreshToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

      const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
        expiresIn: "15m",
      });

      sendResponse(res, 200, "Access token refreshed", {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (err) {
    sendResponse(res, 500, "Could not refresh token");
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendResponse(res, 400, "Refresh token required");

    await knex("refresh_tokens").where({ token: refreshToken }).del();

    sendResponse(res, 200, "Logged out successfully");
  } catch (err) {
    sendResponse(res, 500, "Logout failed");
  }
};
