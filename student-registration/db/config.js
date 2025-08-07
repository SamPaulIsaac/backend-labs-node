const mysql = require("mysql2");
const logger = require("../utils/logger");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "r00t",
  database: "node_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    logger.error("Database connection failed:", err);
  } else {
    logger.info("MySQL pool connected successfully");
    connection.release();
  }
});

module.exports = pool.promise();
