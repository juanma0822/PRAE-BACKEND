const pool = require('../db');

const insertUsuario = async (documento_identidad, nombre, apellido, correo, contraseña, rol, institucion) => {
    const query = `
        INSERT INTO Usuario (documento_identidad, nombre, apellido, correo, contraseña, rol, institucion)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [documento_identidad, nombre, apellido, correo, contraseña, rol, institucion]; 
    const result = await pool.query(query, values);
    return result.rows[0];
};

const insertProfesor = async (documento_identidad, area_ensenanza) => {
    await pool.query(
        'INSERT INTO Profesor (documento_identidad, area_ensenanza) VALUES ($1, $2)',
        [documento_identidad, area_ensenanza]
    );
};

const insertEstudiante = async (documento_identidad, id_curso) => {
    await pool.query(
        'INSERT INTO Estudiante (documento_identidad, id_curso) VALUES ($1, $2)',
        [documento_identidad, id_curso]
    );
};

const getUsuariosActivos = async () => {
    const result = await pool.query('SELECT * FROM Usuario WHERE activo = TRUE');
    return result.rows;
};

const updateUsuario = async (documento_identidad, nombre, apellido, correo, rol, institucion) => {
    const result = await pool.query(
        'UPDATE Usuario SET nombre = $1, apellido = $2, correo = $3, rol = $4, institucion = $5 WHERE documento_identidad = $6 RETURNING *',
        [nombre, apellido, correo, rol, institucion, documento_identidad]
    );
    return result.rows[0];
};

const desactivarUsuario = async (documento_identidad) => {
    await pool.query('UPDATE Usuario SET activo = FALSE WHERE documento_identidad = $1', [documento_identidad]);
};

const activarUsuario = async (documento_identidad) => {
    const query = `
        UPDATE Usuario 
        SET activo = TRUE 
        WHERE documento_identidad = $1 AND activo = FALSE
        RETURNING *;
    `;
    const result = await pool.query(query, [documento_identidad]);
    return result.rows[0];
};



const getUsuariosByRol = async (rol) => {
    const query = `
        SELECT documento_identidad, nombre, apellido, correo, rol, institucion, activo 
        FROM Usuario 
        WHERE rol = $1 AND activo = TRUE;
    `;
    const result = await pool.query(query, [rol]);
    return result.rows;
};


module.exports = { insertUsuario, insertProfesor, insertEstudiante, getUsuariosActivos, updateUsuario, desactivarUsuario, activarUsuario, getUsuariosByRol  };
