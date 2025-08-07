// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Registration API",
      version: "1.0.0",
      description: "API documentation for the Student Registration system",
    },
    servers: [
      {
        url: "http://localhost:3000", // Adjust if using a different port
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to route files where annotations exist
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;
