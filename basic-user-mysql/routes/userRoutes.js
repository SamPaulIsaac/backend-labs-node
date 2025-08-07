const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

function handleUserRoutes(req, res) {
  const { method, url } = req;

  if (url === "/users" && method === "GET") return getUsers(req, res);
  if (url === "/users" && method === "POST") return createUser(req, res);

  if (url.startsWith("/users/")) {
    const id = url.split("/")[2];
    if (method === "GET") return getUserById(req, res, id);
    if (method === "PUT") return updateUser(req, res, id);
    if (method === "DELETE") return deleteUser(req, res, id);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
}

module.exports = { handleUserRoutes };
