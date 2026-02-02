const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "orepoitunuola",
  database: "smart_estate",
});

module.exports = db;