const db = require("../config/db");

exports.getAllPayments = (req, res) => {
  db.query("SELECT * FROM payments", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getUserPayments = (req, res) => {
  const { userId } = req.params;
  db.query("SELECT * FROM payments WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createPayment = (req, res) => {
  const { userId, amount, description } = req.body;
  db.query(
    "INSERT INTO payments (user_id, amount, description, status) VALUES (?, ?, ?, 'completed')",
    [userId, amount, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Payment successful", id: result.insertId });
    }
  );
};

exports.getDues = (req, res) => {
  const { userId } = req.params;
  // Mock logic: calculate dues. In real app, check 'payments' table pending items.
  // For now, return a random or fixed amount if no pending payments found.
  db.query("SELECT * FROM payments WHERE user_id = ? AND status = 'pending'", [userId], (err, results) => {
    if (err) return res.status(500).json(err);

    let totalDues = 0;
    if (results.length > 0) {
      totalDues = results.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    }
    res.json({ amount: totalDues });
  });
};