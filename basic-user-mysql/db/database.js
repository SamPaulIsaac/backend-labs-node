const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "r00t", // Replace with your password
  database: "node_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL");
});

module.exports = db;
