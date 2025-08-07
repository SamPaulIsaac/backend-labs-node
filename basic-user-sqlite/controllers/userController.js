const db = require("../db/database");
const { parseBody } = require("../utils/parseBody");

async function getUsers(req, res) {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Failed to fetch users" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ users: rows }));
  });
}

async function getUserById(req, res, id) {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Internal server error" }));
    }
    if (!row) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: "User not found" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ user: row }));
  });
}

async function createUser(req, res) {
  try {
    const body = await parseBody(req);
    const { name, email } = body;

    if (!name || !email) {
      res.writeHead(400);
      return res.end(
        JSON.stringify({ message: "Name and email are required" })
      );
    }

    db.run(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
      function (err) {
        if (err) {
          res.writeHead(500);
          return res.end(JSON.stringify({ message: "Failed to create user" }));
        }

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "User created", userId: this.lastID })
        );
      }
    );
  } catch (err) {
    res.writeHead(400);
    res.end(JSON.stringify({ message: err.message }));
  }
}

async function updateUser(req, res, id) {
  try {
    const body = await parseBody(req);
    const { name, email } = body;

    db.run(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id],
      function (err) {
        if (err || this.changes === 0) {
          res.writeHead(404);
          return res.end(
            JSON.stringify({ message: "User not found or not updated" })
          );
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User updated" }));
      }
    );
  } catch (err) {
    res.writeHead(400);
    res.end(JSON.stringify({ message: err.message }));
  }
}

async function deleteUser(req, res, id) {
  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err || this.changes === 0) {
      res.writeHead(404);
      return res.end(
        JSON.stringify({ message: "User not found or already deleted" })
      );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User deleted" }));
  });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
