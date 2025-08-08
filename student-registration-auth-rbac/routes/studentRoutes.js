const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

// Apply authentication to all student routes
router.use(authenticate);

// Only admin and advisor can see all students
router.get("/", authorize("admin", "advisor"), controller.getAll);

// Admin, advisor can get any student; student only their own (checked inside controller)
router.get(
  "/:id",
  authorize("admin", "advisor", "student"),
  controller.getById
);

// Only admin and advisor can create, update, delete
router.post("/", authorize("admin", "advisor"), controller.create);
router.put("/:id", authorize("admin", "advisor"), controller.update);
router.delete("/:id", authorize("admin", "advisor"), controller.remove);

module.exports = router;
