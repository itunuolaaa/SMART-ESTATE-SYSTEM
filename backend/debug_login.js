const db = require('./src/config/db');
const axios = require('axios');

async function debugAll() {
    const email = 'admin@test.com';
    console.log("1. Direct DB Query...");
    try {
        const [rows] = await db.promise().query("SELECT email FROM users WHERE email = ?", [email]);
        console.log("   Found in DB:", rows.length > 0 ? "YES" : "NO", rows);
    } catch (err) {
        console.error("   DB Error:", err.message);
    }

    console.log("2. HTTP Live Request...");
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password: 'password123' });
        console.log("   HTTP Success:", res.data);
    } catch (err) {
        console.log("   HTTP Fail:", err.response?.status, err.response?.data || err.message);
    }
    process.exit();
}

debugAll();
