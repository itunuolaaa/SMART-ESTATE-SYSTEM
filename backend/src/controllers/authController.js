const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hash, role],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for:", email);

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        try {
          if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
          }

          if (!results.length) {
            console.log("User not found:", email);
            return res.status(404).json({ message: "User not found" });
          }

          const user = results[0];
          console.log("User found:", user.email);

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            console.log("Invalid password for:", email);
            return res.status(401).json({ message: "Invalid credentials" });
          }

          console.log("Password valid, generating token...");
          const token = jwt.sign(
            { id: user.id, role: user.role },
            secret,
            { expiresIn: '1d' }
          );

          console.log("Login successful for:", email);
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        } catch (innerErr) {
          console.error("Error in login callback:", innerErr);
          return res.status(500).json({ message: "Server error", error: innerErr.message });
        }
      }
    );
  } catch (outerErr) {
    console.error("Error in login handler:", outerErr);
    return res.status(500).json({ message: "Server error", error: outerErr.message });
  }
};