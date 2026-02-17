const db = require("../config/db");

exports.lodgeComplaint = (req, res) => {
    const { userId, title, description } = req.body;

    if (!userId || !title || !description) {
        return res.status(400).json({ message: "Missing fields" });
    }

    db.query(
        "INSERT INTO complaints (user_id, title, description) VALUES (?, ?, ?)",
        [userId, title, description],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Complaint lodged successfully", id: result.insertId });
        }
    );
};

exports.getAllComplaints = (req, res) => {
    db.query(
        `SELECT c.*, u.name as user_name 
       FROM complaints c 
       JOIN users u ON c.user_id = u.id 
       ORDER BY c.date DESC`,
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
};

exports.getUserComplaints = (req, res) => {
    const { userId } = req.params;
    db.query("SELECT * FROM complaints WHERE user_id = ? ORDER BY date DESC", [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.updateComplaintStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE complaints SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Complaint updated" });
    });
};
