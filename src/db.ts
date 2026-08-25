import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/feedback',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

