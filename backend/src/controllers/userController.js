const db = require("../config/db");

exports.getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, phone, role FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};