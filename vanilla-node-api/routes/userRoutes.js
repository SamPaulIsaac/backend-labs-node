const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { URL } = require("url");

function handleUserRoutes(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Route: GET /users
  if (pathname === "/users" && method === "GET") return getUsers(req, res);

  // Route: POST /users
  if (pathname === "/users" && method === "POST") return createUser(req, res);

  // Routes with ID: /users/:id
  const userIdMatch = pathname.match(/^\/users\/([a-zA-Z0-9-_]+)$/);
  if (userIdMatch) {
    const id = userIdMatch[1];

    if (method === "GET") return getUserById(req, res, id);
    if (method === "PUT") return updateUser(req, res, id);
    if (method === "DELETE") return deleteUser(req, res, id);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
}

module.exports = { handleUserRoutes };
