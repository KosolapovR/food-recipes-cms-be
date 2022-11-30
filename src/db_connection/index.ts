import mysql, { Pool } from "mysql2/promise";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool: Pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  enableKeepAlive: true,
});

const getConnection = (): Pool => pool;

export { getConnection };
