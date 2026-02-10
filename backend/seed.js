const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

const users = [
    { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' },
    { name: 'John Resident', email: 'resident@test.com', password: 'password123', role: 'resident' },
    { name: 'Mr. Landlord', email: 'landlord@test.com', password: 'password123', role: 'landlord' },
    { name: 'Security Guard', email: 'security@test.com', password: 'password123', role: 'security' },
];

async function seed() {
    console.log('Seeding database...');

    // Clear existing users? Maybe better not to force it, but for a seed script it's expected.
    // We'll just insert if not exists or ignore duplicates based on email.

    for (const user of users) {
        const hash = await bcrypt.hash(user.password, 10);
        try {
            await db.promise().query(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=name",
                [user.name, user.email, hash, user.role]
            );
            console.log(`Created user: ${user.email} (${user.role})`);
        } catch (err) {
            console.error(`Error creating ${user.email}:`, err.message);
        }
    }

    console.log('Seeding complete. Default password is "password123".');
    process.exit();
}

seed();
