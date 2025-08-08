const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentController");

const authenticate = require("../middlewares/authenticate");

// Apply authentication to all student routes
router.use(authenticate);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

module.exports = router;
