import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'feedback',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});