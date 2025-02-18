const { config } = require('dotenv');
config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
        require: true,
        rejectUnauthorized: false // Necesario para Aiven
    }
});

pool.connect()
    .then(() => console.log('✅ Conexión exitosa a PostgreSQL en Aiven'))
    .catch((err) => console.error('❌ Error al conectar con la base de datos:', err));

module.exports = pool;
