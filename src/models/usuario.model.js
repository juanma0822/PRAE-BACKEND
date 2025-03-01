const pool = require("../db");
const bcrypt = require("bcryptjs");

const ExistingUser = async (email, password = null) => {
  const client = await pool.connect();
  try {
    const verifyEmail = await client.query(
      "SELECT * FROM usuario WHERE correo = $1",
      [email]
    );

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

    if (user.rol === "estudiante") {
      const cursoResult = await client.query(
        `
          SELECT c.id_curso, c.nombre AS curso
          FROM Estudiante e
          INNER JOIN Curso c ON e.id_curso = c.id_curso
          WHERE e.documento_identidad = $1
      `,
        [user.documento_identidad]
      );
      user.id_curso = cursoResult.rows[0].id_curso;
      user.curso = cursoResult.rows[0].curso;
    }

    console.log("Ingreso exitoso");
    return user;
  } finally {
    client.release();
  }
};

const insertUsuario = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  rol,
  institucion
) => {
  const client = await pool.connect();
  try {
    const query = `
          INSERT INTO Usuario (documento_identidad, nombre, apellido, correo, contraseña, rol, institucion)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
      `;
    const values = [
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      rol,
      institucion,
    ];
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const insertProfesor = async (documento_identidad, area_ensenanza) => {
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO Profesor (documento_identidad, area_ensenanza) VALUES ($1, $2)",
      [documento_identidad, area_ensenanza]
    );
  } finally {
    client.release();
  }
};

const insertEstudiante = async (documento_identidad, id_curso) => {
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO Estudiante (documento_identidad, id_curso) VALUES ($1, $2)",
      [documento_identidad, id_curso]
    );
  } finally {
    client.release();
  }
};

const getUsuariosActivos = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM Usuario WHERE activo = TRUE");
    return result.rows;
  } finally {
    client.release();
  }
};

const updateUsuario = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  rol,
  institucion
) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE Usuario SET nombre = $1, apellido = $2, correo = $3, rol = $4, institucion = $5 WHERE documento_identidad = $6 RETURNING *",
      [nombre, apellido, correo, rol, institucion, documento_identidad]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const desactivarUsuario = async (documento_identidad) => {
  const client = await pool.connect();
  try {
    await client.query(
      "UPDATE Usuario SET activo = FALSE WHERE documento_identidad = $1",
      [documento_identidad]
    );
  } finally {
    client.release();
  }
};

const activarUsuario = async (documento_identidad) => {
  const client = await pool.connect();
  try {
    const query = `
          UPDATE Usuario 
          SET activo = TRUE 
          WHERE documento_identidad = $1 AND activo = FALSE
          RETURNING *;
      `;
    const result = await client.query(query, [documento_identidad]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Obtener usuarios por el rol
const getUsuariosByRol = async (rol) => {
  const client = await pool.connect();
  try {
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
                  p.area_ensenanza, d.id_materia, m.nombre AS materia, c.id_curso, c.nombre AS curso
              FROM Usuario u
              INNER JOIN Profesor p ON u.documento_identidad = p.documento_identidad
              LEFT JOIN Dictar d ON p.documento_identidad = d.documento_profe
              LEFT JOIN Materia m ON d.id_materia = m.id_materia
              LEFT JOIN Asignar a ON m.id_materia = a.id_materia
              LEFT JOIN Curso c ON a.id_curso = c.id_curso
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

    const result = await client.query(query, [rol]);

    if (rol === "docente") {
      const profesores = {};
      result.rows.forEach((row) => {
        if (!profesores[row.documento_identidad]) {
          profesores[row.documento_identidad] = {
            documento_identidad: row.documento_identidad,
            nombre: row.nombre,
            apellido: row.apellido,
            correo: row.correo,
            rol: row.rol,
            institucion: row.institucion,
            activo: row.activo,
            area_ensenanza: row.area_ensenanza,
            materias: [],
          };
        }
        if (row.id_materia) {
          profesores[row.documento_identidad].materias.push({
            id_materia: row.id_materia,
            nombre_materia: row.materia,
            id_curso: row.id_curso,
            nombre_curso: row.curso,
          });
        }
      });
      return Object.values(profesores);
    }

    return result.rows;
  } finally {
    client.release();
  }
};

// Obtener un profesor por su ID
const getProfesorById = async (documento_identidad) => {
  const client = await pool.connect();
  try {
    const query = `
          SELECT 
              u.documento_identidad, u.nombre, u.apellido, u.correo, u.rol, u.institucion, u.activo,
              p.area_ensenanza
          FROM Usuario u
          INNER JOIN Profesor p ON u.documento_identidad = p.documento_identidad
          WHERE u.documento_identidad = $1 AND u.rol = 'docente' AND u.activo = TRUE;
      `;
    const result = await client.query(query, [documento_identidad]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Obtener un estudiante por su ID
const getEstudianteById = async (documento_identidad) => {
  const client = await pool.connect();
  try {
    const query = `
          SELECT 
              u.documento_identidad, u.nombre, u.apellido, u.correo, u.rol, u.institucion, u.activo,
              e.id_curso, c.nombre AS curso
          FROM Usuario u
          INNER JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
          INNER JOIN Curso c ON e.id_curso = c.id_curso
          WHERE u.documento_identidad = $1 AND u.rol = 'estudiante' AND u.activo = TRUE;
      `;
    const result = await client.query(query, [documento_identidad]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Obtener estudiantes por institución
const getEstudiantesPorInstitucion = async (institucion) => {
  const client = await pool.connect();
  try {
    const query = `
          SELECT u.documento_identidad, u.nombre, u.apellido, u.correo, u.rol, u.institucion, u.activo, e.id_curso, c.nombre AS curso
          FROM Usuario u
          INNER JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
          INNER JOIN Curso c ON e.id_curso = c.id_curso
          WHERE u.institucion = $1 AND u.rol = 'estudiante' AND u.activo = TRUE;
      `;
    const result = await client.query(query, [institucion]);
    return result.rows;
  } finally {
    client.release();
  }
};

// Obtener estudiantes por profesor
const getEstudiantesPorProfesor = async (documento_profe) => {
  const client = await pool.connect();
  try {
    const query = `
          SELECT u.documento_identidad, u.nombre, u.apellido, u.correo, u.rol, u.institucion, u.activo, e.id_curso, c.nombre AS curso
          FROM Usuario u
          INNER JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
          INNER JOIN Curso c ON e.id_curso = c.id_curso
          INNER JOIN Dictar d ON e.id_curso = d.id_curso
          WHERE d.documento_profe = $1 AND u.rol = 'estudiante' AND u.activo = TRUE;
      `;
    const result = await client.query(query, [documento_profe]);
    return result.rows;
  } finally {
    client.release();
  }
};

// Modelo para actualizar un profesor
const updateProfesor = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  institucion,
  area_ensenanza
) => {
  const client = await pool.connect();
  try {
    const query = `
          UPDATE Usuario 
          SET nombre = $1, apellido = $2, correo = $3, ${
            contraseña ? "contraseña = $4," : ""
          } institucion = $5
          WHERE documento_identidad = $6
          RETURNING *;
      `;

    const values = contraseña
      ? [nombre, apellido, correo, contraseña, institucion, documento_identidad]
      : [nombre, apellido, correo, institucion, documento_identidad];

    await client.query(query, values);

    // Actualizar el área de enseñanza en la tabla Profesor
    const queryProfesor = `
          UPDATE Profesor 
          SET area_ensenanza = $1 
          WHERE documento_identidad = $2
          RETURNING *;
      `;

    const result = await client.query(queryProfesor, [
      area_ensenanza,
      documento_identidad,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Modelo para actualizar un estudiante
const updateEstudiante = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  institucion,
  id_curso
) => {
  const client = await pool.connect();
  try {
    const query = `
          UPDATE Usuario 
          SET nombre = $1, apellido = $2, correo = $3, ${
            contraseña ? "contraseña = $4," : ""
          } institucion = $5
          WHERE documento_identidad = $6
          RETURNING *;
      `;

    const values = contraseña
      ? [nombre, apellido, correo, contraseña, institucion, documento_identidad]
      : [nombre, apellido, correo, institucion, documento_identidad];

    await client.query(query, values);

    // Actualizar el curso del estudiante en la tabla Estudiante
    const queryEstudiante = `
          UPDATE Estudiante 
          SET id_curso = $1 
          WHERE documento_identidad = $2
          RETURNING *;
      `;

    const result = await client.query(queryEstudiante, [
      id_curso,
      documento_identidad,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

module.exports = {
  ExistingUser,
  insertUsuario,
  insertProfesor,
  insertEstudiante,
  getUsuariosActivos,
  updateUsuario,
  desactivarUsuario,
  activarUsuario,
  getUsuariosByRol,
  updateEstudiante,
  updateProfesor,
  getEstudiantesPorInstitucion,
  getEstudiantesPorProfesor,
  getProfesorById,
  getEstudianteById,
};