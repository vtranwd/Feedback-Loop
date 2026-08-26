const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/feedback',
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database migration...');
    
    const sql = fs.readFileSync(path.join(__dirname, '../init.sql'), 'utf8');
    await client.query(sql);
    
    console.log('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

