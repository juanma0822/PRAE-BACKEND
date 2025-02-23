
const Pool = require('../db');
const bcrypt = require("bcrypt");

const ExistingUser = async(email,password=null) => {
   console.log(typeof(password))
    const verifyEmail = await Pool.query('SELECT * FROM usuario WHERE correo = $1', [email]);
  
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

  const SearchDataAllStudents = async (id, curse, subject) => {
    try {
      
      let query = `
        SELECT *
        FROM estudiante
        INNER JOIN curso ON estudiante.id_curso = curso.id_curso
        INNER JOIN asignar ON curso.id_curso = asignar.id_curso
        INNER JOIN materia ON asignar.id_materia = materia.id_materia
        INNER JOIN calificacion ON estudiante.documento_identidad = calificacion.id_estudiante
        WHERE curso.nombre = $1 AND materia.nombre = $2`;
      
      let values = [curse, subject];
  
      if (id !="all") {
        query += " AND estudiante.documento_identidad = $3";
        values.push(id);
     
       
      }
  
      const result = await Pool.query(query, values);
      return result.rows;
    } catch (e) {
      return e;
    }
  };
  
const FindOneStudentModels=async()=>{
try{

}catch(e){
  return e
}
}

module.exports = {ExistingUser,saveMessage,getMessages,SearchDataAllStudents,FindOneStudentModels}