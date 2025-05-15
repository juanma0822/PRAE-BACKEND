const { config } = require("dotenv");
config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: {
    require: true,
    rejectUnauthorized: false, // Necesario para Aiven
  },
  max: 15, // 🔹 Máximo de conexiones en el pool
  idleTimeoutMillis: 15000, // 🔹 Cierra conexiones inactivas después de 15s
  connectionTimeoutMillis: 10000, // 🔹 Tiempo de espera para nuevas conexiones
});

pool.on("connect", () => {
  console.log("✅ Conexión exitosa a PostgreSQL en Aiven");
});

pool.on("remove", () => {
  console.log("🔄 Conexión removida del pool");
});

// 🔹 Función para consultar la DB y liberar la conexión
async function consultarDB(query, params, retries = 2) {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query(query, params);
      return res.rows;
    } finally {
      client.release();
    }
  } catch (err) {
    if (retries > 0 && err.code === 'ETIMEDOUT') {
      await new Promise(r => setTimeout(r, 100 * (3 - retries)));
      return consultarDB(query, params, retries - 1);
    }
    throw err;
  }
}

// 🔹 Cierra conexiones al apagar Express
process.on("SIGINT", async () => {
  await pool.end();
  console.log("🚪 Conexión cerrada con PostgreSQL");
  process.exit(0);
});

module.exports = { pool, consultarDB, getClient: () => pool.connect() };
