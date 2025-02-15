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

const insertProfesor = async (documento_identidad, area_ensenanza, id_materia) => {
    const client = await pool.connect(); // Obtener conexión
    try {
        await client.query('BEGIN');

        await client.query(
            'INSERT INTO Profesor (documento_identidad, area_ensenanza) VALUES ($1, $2)',
            [documento_identidad, area_ensenanza]
        );

        // Insertar la relación en la tabla Dictar
        await client.query(
            'INSERT INTO Dictar (documento_profe, id_materia) VALUES ($1, $2)',
            [documento_identidad, id_materia]
        );

        await client.query('COMMIT'); //Confirmar transaccion
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir en caso de error
        throw error;
    } finally {
        client.release(); // Liberar conexión
    }
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
    let query = "";
    
    if (rol === "admin") {
        query = `
            SELECT 
                u.documento_identidad, u.nombre, u.apellido, u.correo, u.rol, u.institucion, u.activo
            FROM Usuario u
            WHERE u.rol = $1 AND u.activo = TRUE;
        `;
    } else if (rol === "docente") {
        query = `
            SELECT 
                u.documento_identidad, u.nombre, u.apellido, u.correo, u.rol, u.institucion, u.activo,
                p.area_ensenanza, d.id_materia, m.nombre AS materia
            FROM Usuario u
            INNER JOIN Profesor p ON u.documento_identidad = p.documento_identidad
            INNER JOIN Dictar d ON p.documento_identidad = d.documento_profe
            INNER JOIN Materia m ON d.id_materia = m.id_materia
            WHERE u.rol = $1 AND u.activo = TRUE;
        `;
    } else if (rol === "estudiante") {
        query = `
            SELECT 
                u.documento_identidad, u.nombre, u.apellido, u.correo, u.rol, u.institucion, u.activo,
                e.id_curso, c.nombre AS curso
            FROM Usuario u
            INNER JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
            INNER JOIN Curso c ON e.id_curso = c.id_curso
            WHERE u.rol = $1 AND u.activo = TRUE;
        `;
    } else {
        throw new Error("Rol no válido");
    }

    const result = await pool.query(query, [rol]);
    return result.rows;
};

// Modelo para actualizar un profesor
const updateProfesor = async (documento_identidad, nombre, apellido, correo, contraseña, institucion, area_ensenanza) => {
    const query = `
        UPDATE Usuario 
        SET nombre = $1, apellido = $2, correo = $3, ${contraseña ? "contraseña = $4," : ""} institucion = $5
        WHERE documento_identidad = $6
        RETURNING *;
    `;

    const values = contraseña ? [nombre, apellido, correo, contraseña, institucion, documento_identidad] 
                              : [nombre, apellido, correo, institucion, documento_identidad];

    await pool.query(query, values);

    // Actualizar el área de enseñanza en la tabla Profesor
    const queryProfesor = `
        UPDATE Profesor 
        SET area_ensenanza = $1 
        WHERE documento_identidad = $2
        RETURNING *;
    `;

    const result = await pool.query(queryProfesor, [area_ensenanza, documento_identidad]);
    return result.rows[0];
};

// Modelo para actualizar un estudiante
const updateEstudiante = async (documento_identidad, nombre, apellido, correo, contraseña, institucion, id_curso) => {
    const query = `
        UPDATE Usuario 
        SET nombre = $1, apellido = $2, correo = $3, ${contraseña ? "contraseña = $4," : ""} institucion = $5
        WHERE documento_identidad = $6
        RETURNING *;
    `;

    const values = contraseña ? [nombre, apellido, correo, contraseña, institucion, documento_identidad] 
                              : [nombre, apellido, correo, institucion, documento_identidad];

    await pool.query(query, values);

    // Actualizar el curso del estudiante en la tabla Estudiante
    const queryEstudiante = `
        UPDATE Estudiante 
        SET id_curso = $1 
        WHERE documento_identidad = $2
        RETURNING *;
    `;

    const result = await pool.query(queryEstudiante, [id_curso, documento_identidad]);
    return result.rows[0];
};


module.exports = { insertUsuario, insertProfesor, insertEstudiante, getUsuariosActivos, updateUsuario, desactivarUsuario, activarUsuario, getUsuariosByRol, updateEstudiante, updateProfesor  };
