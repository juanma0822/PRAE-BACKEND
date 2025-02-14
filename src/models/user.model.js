
const Pool = require('../db');
const bcrypt = require("bcrypt");

const ExistingUser = async(email,password=null) => {
   console.log(typeof(password))
    const verifyEmail = await Pool.query('SELECT * FROM usuario WHERE correo = $1', ["carlos.delgado@gmail.com"]);
  
    const user = verifyEmail.rows[0];
    if (!user) {
        throw new Error("El email no está registrado");
    }
 
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Contraseña incorrecta");
    }
    
    console.log("Ingreso exitoso");
    return user;
}


module.exports = {ExistingUser}