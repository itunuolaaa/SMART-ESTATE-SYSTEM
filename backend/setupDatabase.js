const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

const schemaPath = path.join(__dirname, 'src', 'config', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// Split by semicolon to get individual queries, filtering out empty ones
const queries = schemaSql.split(';').filter(query => query.trim().length > 0);

async function runSchema() {
    console.log('Running schema setup...');
    for (const query of queries) {
        try {
            await db.promise().query(query);
            console.log('Executed query successfully.');
        } catch (err) {
            console.error('Error executing query:', err);
        }
    }
    console.log('Schema setup complete.');
    process.exit();
}

runSchema();
