const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.makePayment = (req, res) => {
  const { user_id, amount } = req.body;
  const receipt = uuidv4();

  db.query(
    "INSERT INTO payments (user_id, amount, status, receipt_number, payment_date) VALUES (?,?, 'paid', ?, NOW())",
    [user_id, amount, receipt],
    () => res.json({ message: "Payment successful", receipt })
  );
};

exports.getPayments = (req, res) => {
  db.query(
    "SELECT * FROM payments WHERE user_id = ?",
    [req.params.userId],
    (err, results) => res.json(results)
  );
};