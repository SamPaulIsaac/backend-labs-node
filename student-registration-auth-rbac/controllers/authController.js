// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const studentModel = require("../models/studentModel");
const sendResponse = require("../utils/sendResponse");
const ValidationError = require("../utils/ValidationError");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables"
  );
}

function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw new ValidationError("Name, email, and password are required");
    }

    const validRoles = ["student", "advisor", "admin"];
    const userRole = validRoles.includes(role) ? role : "student";

    const existingUser = await userModel.getUserByEmail(email.trim());
    if (existingUser) {
      throw new ValidationError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = await userModel.createUser({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: userRole,
    });

    if (userRole === "student") {
      // Create empty student profile on registration for student
      await studentModel.createStudent({ user_id: newUser.id, course: "" });
    }

    // Return only user info, no tokens on register
    sendResponse(res, 201, "User registered successfully", {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      throw new ValidationError("Email and password are required");
    }

    const user = await userModel.getUserByEmail(email.trim());
    if (!user) {
      throw new ValidationError("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password.trim(), user.password);
    if (!passwordMatch) {
      throw new ValidationError("Invalid email or password");
    }

    const tokens = generateTokens(user);

    // Store refresh token
    await userModel.updateUserRefreshToken(user.id, tokens.refreshToken);

    sendResponse(res, 200, "Login successful", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ValidationError("Refresh token is required");
    }

    const user = await userModel.getUserByRefreshToken(refreshToken);
    if (!user) {
      throw new ValidationError("Invalid refresh token");
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err) => {
      if (err) {
        throw new ValidationError("Invalid or expired refresh token");
      }

      const tokens = generateTokens(user);

      // Update refresh token in DB
      await userModel.updateUserRefreshToken(user.id, tokens.refreshToken);

      sendResponse(res, 200, "Token refreshed", tokens);
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ValidationError("Refresh token is required");
    }

    const user = await userModel.getUserByRefreshToken(refreshToken);
    if (user) {
      await userModel.updateUserRefreshToken(user.id, null);
    }

    sendResponse(res, 200, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};
