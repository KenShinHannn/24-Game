import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';
import * as schema from '../../schema/users/users.schema.'
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
async function testDbConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to the database');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}
testDbConnection();

export const db = drizzle(pool, { schema })
