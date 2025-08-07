const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require("../db/knex");
const sendResponse = require("../utils/sendResponse");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await knex("users").where({ username }).first();
    if (existingUser) {
      return sendResponse(res, 400, "Username already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await knex("users")
      .insert({ username, password: hashedPassword })
      .returning(["id", "username"]);

    sendResponse(res, 201, "User registered successfully", user);
  } catch (err) {
    sendResponse(res, 500, "Registration failed", err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await knex("users").where({ username }).first();
    if (!user) return sendResponse(res, 401, "Invalid username or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendResponse(res, 401, "Invalid username or password");

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    sendResponse(res, 200, "Login successful", { token });
  } catch (err) {
    sendResponse(res, 500, "Login failed", err.message);
  }
};
