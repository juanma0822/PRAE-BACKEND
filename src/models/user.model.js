const Pool = require('../db');
const bcrypt = require("bcryptjs");

const ExistingUser = async(email, password = null) => {
    console.log(typeof(password));
    const verifyEmail = await Pool.query('SELECT * FROM usuario WHERE correo = $1', [email]);
  
    const user = verifyEmail.rows[0];
    if (!user) {
        throw new Error("El email no está registrado");
    }

    if (password) {
        const passwordMatch = await bcrypt.compare(password, user.contraseña);
        if (!passwordMatch) {
            throw new Error("Contraseña incorrecta");
        }
    }
    
    console.log("Ingreso exitoso");
    return user;
}

module.exports = { ExistingUser };