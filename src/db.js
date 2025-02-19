const {config} = require('dotenv');
config();

const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "Dios2004!!",
    host: "localhost",
    port: 5432,
    database: "sistema_notas"
});


module.exports = pool;