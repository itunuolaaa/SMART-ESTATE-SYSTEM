const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");

exports.register = async (req, res) => {
  const { full_name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (full_name, email, password_hash, role) VALUES (?,?,?,?)",
    [full_name, email, hash, role],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (!results.length) return res.status(404).json({ message: "User not found" });

      const user = results[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ message: "Wrong password" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        secret,
        { expiresIn }
      );

      res.json({ token, role: user.role });
    }
  );
};