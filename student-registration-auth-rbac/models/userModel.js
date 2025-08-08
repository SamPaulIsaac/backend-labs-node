const db = require("../db/knex");
const logger = require("../utils/logger");

// Fetch user by email (for login/register)
const getUserByEmail = async (email) => {
  const user = await db("users").where({ email }).first();
  logger.info(`Fetched user by email: ${email}`);
  return user;
};

// Create a new user record
const createUser = async ({ name, email, password, role }) => {
  const [id] = await db("users").insert({ name, email, password, role });
  logger.info(`Created new user with ID ${id}`);
  return { id, name, email, role };
};

// Get user by refresh token (for token refresh)
const getUserByRefreshToken = async (refreshToken) => {
  const user = await db("users").where({ refresh_token: refreshToken }).first();
  logger.info(`Fetched user by refresh token`);
  return user;
};

// Update user's refresh token
const updateUserRefreshToken = async (id, refreshToken) => {
  await db("users").where({ id }).update({ refresh_token: refreshToken });
  logger.info(`Updated refresh token for user ID ${id}`);
};

module.exports = {
  getUserByEmail,
  createUser,
  getUserByRefreshToken,
  updateUserRefreshToken,
};
