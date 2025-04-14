import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.PG_USER,
  host: "localhost",
  database: "sistemaReserva",
  password: process.env.PG_PASSWORD,
  port: 5432,
});
