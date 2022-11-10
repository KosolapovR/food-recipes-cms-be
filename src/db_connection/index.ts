import mysql, { Pool } from "mysql2/promise";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

let pool: Pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

async function keepAlive() {
  const { ping, release } = await pool.getConnection();
  await ping();
  release();
}

setInterval(keepAlive, 60000); // ping to DB every minute

const getConnection = (): Pool => pool;

export { getConnection };
