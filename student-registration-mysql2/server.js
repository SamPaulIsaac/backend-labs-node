const express = require("express");
const app = express();
const studentRoutes = require("./routes/studentRoutes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./utils/logger");

app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Route registration
app.use("/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Student Registration Application.");
});

// Error handler (must come after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
