const Pool = require('../db');

const ExistingUser = async(email) => {
    const verifyEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    return verifyEmail.rows[0];
}

module.exports = ExistingUser;