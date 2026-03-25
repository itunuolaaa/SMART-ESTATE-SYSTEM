// require("dotenv").config();
// const mysql = require("mysql2");

// const db = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "smart_estate",
//   port: 3306
// });

// db.getConnection((err, connection) => {
//   if (err) {
//     console.error("❌ DB ERROR:", err);
//   } else {
//     console.log("✅ MySQL Connected!");
//     connection.release();
//   }
// });

// module.exports = db;
// require("dotenv").config();
// const { Pool } = require("pg");

// Create a new PostgreSQL pool using environment variables
// const pool = new Pool({
//   host: process.env.DB_HOST,       // e.g., smartestate-db.postgres.render.com
//   user: process.env.DB_USER,       // e.g., render
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,   // e.g., smart_estate
//   port: process.env.DB_PORT || 5432, // default Postgres port
//   ssl: { rejectUnauthorized: false } // Required for Render Postgres
// });

// Test connection
// pool.connect()
//   .then(() => console.log("✅ PostgreSQL Connected!"))
//   .catch(err => console.error("❌ PostgreSQL connection error:", err));

// module.exports = pool;

require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB ERROR:", err);
  } else {
    console.log("✅ MySQL Connected!");
    connection.release();
  }
});

module.exports = db;