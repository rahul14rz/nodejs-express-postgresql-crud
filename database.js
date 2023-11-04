import pg from 'pg';

const pool = new pg.Pool({
  user: 'me',
  host: 'localhost',
  database: 'posts-db',
  password: 'password',
  port: 5432
});

export { pool };
