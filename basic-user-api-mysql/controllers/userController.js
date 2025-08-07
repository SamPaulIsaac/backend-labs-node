const db = require("../db/database");
const { parseBody } = require("../utils/parseBody");
const { sendResponse } = require("../utils/sendResponse");

async function getUsers(req, res) {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return sendResponse(res, 500, { message: "Failed to fetch users" });
    }

    return sendResponse(res, 200, { users: results });
  });
}

async function getUserById(req, res, id) {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      return sendResponse(res, 500, { message: "Internal server error" });
    }

    const user = results[0];
    if (!user) {
      return sendResponse(res, 404, { message: "User not found" });
    }

    return sendResponse(res, 200, { user });
  });
}

async function createUser(req, res) {
  try {
    const body = await parseBody(req);
    const { name, email } = body;

    if (!name || !email) {
      return sendResponse(res, 400, { message: "Name and email are required" });
    }

    db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
      (err, result) => {
        if (err) {
          return sendResponse(res, 500, { message: "Failed to create user" });
        }

        return sendResponse(res, 201, {
          message: "User created",
          userId: result.insertId,
        });
      }
    );
  } catch (err) {
    return sendResponse(res, 400, { message: err.message });
  }
}

async function updateUser(req, res, id) {
  try {
    const body = await parseBody(req);
    const { name, email } = body;

    db.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id],
      (err, result) => {
        if (err || result.affectedRows === 0) {
          return sendResponse(res, 404, {
            message: "User not found or not updated",
          });
        }

        return sendResponse(res, 200, { message: "User updated" });
      }
    );
  } catch (err) {
    return sendResponse(res, 400, { message: err.message });
  }
}

async function deleteUser(req, res, id) {
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err || result.affectedRows === 0) {
      return sendResponse(res, 404, {
        message: "User not found or already deleted",
      });
    }

    return sendResponse(res, 200, { message: "User deleted" });
  });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
