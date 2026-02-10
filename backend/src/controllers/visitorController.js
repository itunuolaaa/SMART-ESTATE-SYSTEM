const db = require("../config/db");
const { v4: uuidv4 } = require('uuid');

exports.generateQRCode = (req, res) => {
    const { residentId, visitorName, visitDate } = req.body;
    const qrCode = uuidv4(); // Generate a unique token for QR

    if (!residentId || !visitorName || !visitDate) {
        return res.status(400).json({ message: "Missing fields" });
    }

    db.query(
        "INSERT INTO visitors (resident_id, visitor_name, qr_code, visit_date) VALUES (?, ?, ?, ?)",
        [residentId, visitorName, qrCode, visitDate],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "QR Code generated", qrCode, id: result.insertId });
        }
    );
};

exports.validateQRCode = (req, res) => {
    const { qrCode } = req.body;

    db.query("SELECT * FROM visitors WHERE qr_code = ?", [qrCode], (err, results) => {
        if (err) return res.status(500).json(err);
        if (!results.length) return res.status(404).json({ message: "Invalid QR Code" });

        const visitor = results[0];
        if (visitor.status === 'checked_in') {
            return res.status(400).json({ message: "QR Code already used" });
        }

        // Mark as checked in
        db.query("UPDATE visitors SET status = 'checked_in' WHERE id = ?", [visitor.id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({
                valid: true,
                visitorName: visitor.visitor_name,
                message: "Access Granted"
            });
        });
    });
};

exports.getVisitorHistory = (req, res) => {
    const { residentId } = req.params;
    db.query("SELECT * FROM visitors WHERE resident_id = ? ORDER BY visit_date DESC", [residentId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
