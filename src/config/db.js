import {neon} from '@neondatabase/serverless'

import 'dotenv/config'

const db = process.env.DB_URL

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
       id SERIAL PRIMARY KEY,
       user_id VARCHAR(255) NOT NULL,
       title VARCHAR(255) NOT NULL,
       amount decimal(10,2) NOT NULL,
       category VARCHAR(255) NOT NULL,
       created_at DATE NOT NULL DEFAULT CURRENT_DATE )`;

    console.log("DB Initialized successfully");
  } catch (error) {
    console.log("ERROR INITIALIZING DB", error);
    process.exit(1);
  }
}

export const sql = neon(db) 