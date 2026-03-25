const db = require('./src/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('./src/config/jwt');

async function testLogin() {
    console.log("Testing login for admin@test.com...");
    const email = 'admin@test.com';
    const password = 'password123';

    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            console.log("FAIL: User not found in database. Did you run seed.js?");
            process.exit(1);
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log("FAIL: Password mismatch.");
            process.exit(1);
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            secret,
            { expiresIn: '1d' }
        );

        console.log("SUCCESS: Login simulated correctly.");
        console.log("Returned User:", { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        });
        console.log("Token generated:", token.substring(0, 20) + "...");
        
        if (!user.role) {
            console.log("FAIL: Role is missing in database record!");
        } else {
            console.log("Role found:", user.role);
        }

    } catch (err) {
        console.error("ERROR during test:", err.message);
    } finally {
        process.exit();
    }
}

testLogin();
