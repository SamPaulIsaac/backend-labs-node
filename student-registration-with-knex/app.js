// app.js
const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./utils/logger");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");

const app = express();

// Middleware: JSON parser
app.use(express.json());

// Middleware: request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use("/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Student Registration Application using knex.");
});

// Error handler (must come after all routes)
app.use(errorHandler);

// Export app for testing
module.exports = app;
