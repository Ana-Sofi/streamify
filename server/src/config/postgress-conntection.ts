import * as postgres from 'postgres';

export const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'streamify',
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});
