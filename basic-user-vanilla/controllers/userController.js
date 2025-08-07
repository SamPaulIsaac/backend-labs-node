const fs = require("fs");
const path = require("path");
const { parseBody } = require("../utils/parseBody");

const dataFile = path.join(__dirname, "../data/users.json");

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]");
}

function readUsers() {
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

function getUsers(req, res) {
  const users = readUsers();

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Fetched all users successfully",
      users,
    })
  );
}

function getUserById(req, res, id) {
  const users = readUsers();
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: `No user found with ID: ${id}` }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: `User with ID: ${id} retrieved successfully`,
      user,
    })
  );
}

async function createUser(req, res) {
  try {
    const body = await parseBody(req);

    if (!body.name || !body.email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Both name and email are required" })
      );
    }

    const users = readUsers();
    const newUser = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
    };

    users.push(newUser);
    writeUsers(users);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "User created successfully",
        user: newUser,
      })
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Failed to create user",
        error: err.message,
      })
    );
  }
}

async function updateUser(req, res, id) {
  try {
    const body = await parseBody(req);
    const users = readUsers();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: `No user found with ID: ${id}` })
      );
    }

    const updatedUser = {
      ...users[userIndex],
      ...body,
      id, // ensure ID is unchanged
    };

    users[userIndex] = updatedUser;
    writeUsers(users);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `User with ID: ${id} updated successfully`,
        user: updatedUser,
      })
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Failed to update user",
        error: err.message,
      })
    );
  }
}

function deleteUser(req, res, id) {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: `No user found with ID: ${id}` }));
  }

  users.splice(index, 1);
  writeUsers(users);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({ message: `User with ID: ${id} deleted successfully` })
  );
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
