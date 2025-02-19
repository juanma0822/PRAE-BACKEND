
const Pool = require('../db');
const bcrypt = require("bcrypt");

const ExistingUser = async(email,password=null) => {
   console.log(typeof(password))
    const verifyEmail = await Pool.query('SELECT * FROM usuario WHERE correo = $1', [email]);
  
    const user = verifyEmail.rows[0];
    if (!user) {
        throw new Error("El email no está registrado");
    }
 
/*     const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Contraseña incorrecta");
    } */
    
    console.log("Ingreso exitoso");
    return user;
}
const saveMessage=async(sender_id, receiver_id, message)=>{
    const result = await Pool.query(
        "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *",
        [sender_id, receiver_id, message]
      );
      const savedMessage = result.rows[0];
      return savedMessage
}
const getMessages = async (sender_id, receiver_id) => {
    const result = await Pool.query(
      `SELECT message,sender_id, receiver_id FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1) 
       ORDER BY created_at ASC`, 
      [sender_id, receiver_id]
    );
  
    return result.rows; 
  };


module.exports = {ExistingUser,saveMessage,getMessages}