const { consultarDB } = require("../db");
const bcrypt = require("bcryptjs");

const ExistingUser = async (email, password = null) => {
  const query = `
    SELECT 
      u.*, 
      i.nombre AS nombre_institucion, 
      i.telefono AS telefono_institucion, 
      i.instagram AS instagram_institucion, 
      i.facebook AS facebook_institucion, 
      i.logo AS logo_institucion, 
      i.color_principal AS color_principal_institucion, 
      i.color_secundario AS color_secundario_institucion, 
      i.fondo AS fondo_institucion, 
      i.color_pildora1 AS color_pildora1_institucion, 
      i.color_pildora2 AS color_pildora2_institucion, 
      i.color_pildora3 AS color_pildora3_institucion, 
      i.estado AS estado_institucion,
      i.direccion AS direccion_institucion
    FROM Usuario u
    LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
    WHERE u.correo = $1;
  `;
  const verifyEmail = await consultarDB(query, [email]);

  const user = verifyEmail[0];
  if (!user) {
    throw new Error("El email no está registrado");
  }

  // Verificar si el usuario está desactivado
  if (!user.activo) {
    throw new Error("Usuario desactivado, comunícate con tu institución para ingresar");
  }

  if (password) {
    const passwordMatch = await bcrypt.compare(password, user.contraseña);
    if (!passwordMatch) {
      throw new Error("Contraseña incorrecta");
    }
  }

  if (user.rol === "estudiante") {
    const cursoResult = await consultarDB(
      `
        SELECT c.id_curso, c.nombre AS curso
        FROM Estudiante e
        INNER JOIN Curso c ON e.id_curso = c.id_curso
        WHERE e.documento_identidad = $1
      `,
      [user.documento_identidad]
    );
    user.id_curso = cursoResult[0].id_curso;
    user.curso = cursoResult[0].curso;
  }

  console.log("Ingreso exitoso");
  return user;
};

const insertUsuario = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  rol,
  id_institucion
) => {
  // Verificar si el usuario ya existe
  const existingUser = await consultarDB(
    "SELECT * FROM Usuario WHERE documento_identidad = $1 OR correo = $2",
    [documento_identidad, correo]
  );

  if (existingUser.length > 0) {
    const user = existingUser[0];
    if (user.documento_identidad === documento_identidad) {
      throw new Error(`El documento de identidad ${documento_identidad} ya está registrado, por favor usa uno nuevo.`);
    }
    if (user.correo === correo) {
      throw new Error(`El correo ${correo} ya está registrado, por favor usa uno nuevo.`);
    }
  }

  // Asignar un color aleatorio si no se proporciona uno
  const colores = ['azul', 'amarillo', 'morado'];
  const colorAsignado = colores[Math.floor(Math.random() * colores.length)];

  const query = `
        INSERT INTO Usuario (documento_identidad, nombre, apellido, correo, contraseña, rol, id_institucion, color)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
  const values = [
    documento_identidad,
    nombre,
    apellido,
    correo,
    contraseña,
    rol,
    id_institucion,
    colorAsignado,
  ];
  const result = await consultarDB(query, values);
  return result[0];
};

const insertProfesor = async (documento_identidad, area_ensenanza) => {
  await consultarDB(
    "INSERT INTO Profesor (documento_identidad, area_ensenanza) VALUES ($1, $2)",
    [documento_identidad, area_ensenanza]
  );
};

const insertEstudiante = async (documento_identidad, id_curso) => {
  await consultarDB(
    "INSERT INTO Estudiante (documento_identidad, id_curso) VALUES ($1, $2)",
    [documento_identidad, id_curso]
  );
};

const getUsuarioByDocumento = async (documento_identidad) => {
  const query = `
    SELECT * FROM Usuario
    WHERE documento_identidad = $1 AND activo = TRUE;
  `;
  const result = await consultarDB(query, [documento_identidad]);
  return result[0];
};

const getUsuariosActivos = async () => {
  const query = `
    SELECT u.*, i.*
    FROM Usuario u
    LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
    WHERE u.activo = TRUE
  `;
  const result = await consultarDB(query);
  return result;
};

const updateUsuario = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  rol,
  id_institucion,
  contraseña
) => {
  // Verificar si el correo ya está en uso por otro usuario
  const existingUser = await consultarDB(
    "SELECT * FROM Usuario WHERE correo = $1 AND documento_identidad != $2",
    [correo, documento_identidad]
  );

  if (existingUser.length > 0) {
    throw new Error("El correo ya está en uso por otro usuario");
  }

  let query;
  let values;

  if (contraseña) {
    query = `
      UPDATE Usuario 
      SET nombre = $1, apellido = $2, correo = $3, contraseña = $4, rol = $5, id_institucion = $6
      WHERE documento_identidad = $7
      RETURNING *;
    `;
    values = [nombre, apellido, correo, contraseña, rol, id_institucion, documento_identidad];
  } else {
    query = `
      UPDATE Usuario 
      SET nombre = $1, apellido = $2, correo = $3, rol = $4, id_institucion = $5
      WHERE documento_identidad = $6
      RETURNING *;
    `;
    values = [nombre, apellido, correo, rol, id_institucion, documento_identidad];
  }

  const result = await consultarDB(query, values);
  return result[0];
};

const desactivarUsuario = async (documento_identidad) => {
  // Verificar si el usuario es un docente
  const queryVerificarDocente = `
    SELECT 1 
    FROM Profesor 
    WHERE documento_identidad = $1
  `;
  const esDocente = await consultarDB(queryVerificarDocente, [documento_identidad]);

  if (esDocente.length > 0) {
    // Si es docente, desactivar todas las relaciones en la tabla Dictar
    const queryDesactivarDictar = `
      UPDATE Dictar 
      SET estado = FALSE 
      WHERE documento_profe = $1
    `;
    await consultarDB(queryDesactivarDictar, [documento_identidad]);
  }

  // Desactivar el usuario
  const queryDesactivarUsuario = `
    UPDATE Usuario 
    SET activo = FALSE 
    WHERE documento_identidad = $1
  `;
  await consultarDB(queryDesactivarUsuario, [documento_identidad]);
};

const activarUsuario = async (documento_identidad) => {
  const query = `
        UPDATE Usuario 
        SET activo = TRUE 
        WHERE documento_identidad = $1 AND activo = FALSE
        RETURNING *;
    `;
  const result = await consultarDB(query, [documento_identidad]);
  return result[0];
};

// Obtener usuarios por el rol
const getUsuariosByRol = async (rol) => {
  let query = "";

  if (rol === "admin") {
    query = `
            SELECT u.*
            FROM Usuario u
            LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
            WHERE u.rol = $1 AND u.activo = TRUE;
        `;
  } else if (rol === "docente") {
    query = `
            SELECT u.*, p.area_ensenanza, d.id_materia, m.nombre AS materia, c.id_curso, c.nombre AS curso
            FROM Usuario u
            INNER JOIN Profesor p ON u.documento_identidad = p.documento_identidad
            LEFT JOIN Dictar d ON p.documento_identidad = d.documento_profe
            LEFT JOIN Materia m ON d.id_materia = m.id_materia
            LEFT JOIN Asignar a ON m.id_materia = a.id_materia
            LEFT JOIN Curso c ON a.id_curso = c.id_curso
            LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
            WHERE u.rol = $1 AND u.activo = TRUE AND d.estado = TRUE;
        `;
  } else if (rol === "estudiante") {
    query = `
            SELECT u.*, e.id_curso, c.nombre AS curso
            FROM Usuario u
            INNER JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
            INNER JOIN Curso c ON e.id_curso = c.id_curso
            LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
            WHERE u.rol = $1 AND u.activo = TRUE;
        `;
  } else {
    throw new Error("Rol no válido");
  }

  const result = await consultarDB(query, [rol]);

  if (rol === "docente") {
    const profesores = {};
    result.forEach((row) => {
      if (!profesores[row.documento_identidad]) {
        profesores[row.documento_identidad] = {
          documento_identidad: row.documento_identidad,
          nombre: row.nombre,
          apellido: row.apellido,
          correo: row.correo,
          rol: row.rol,
          activo: row.activo,
          color: row.color,
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

  return result;
};

// Obtener un profesor por su ID
const getProfesorById = async (documento_identidad) => {
  const query = `
    SELECT u.*, p.area_ensenanza, m.id_materia, m.nombre AS materia
    FROM Usuario u
    INNER JOIN Profesor p ON u.documento_identidad = p.documento_identidad
    LEFT JOIN Dictar d ON p.documento_identidad = d.documento_profe
    LEFT JOIN Materia m ON d.id_materia = m.id_materia
    LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
    WHERE u.documento_identidad = $1 AND u.rol = 'docente' AND u.activo = TRUE AND d.estado = TRUE;
  `;
  const result = await consultarDB(query, [documento_identidad]);

  // Verificar si se encontraron resultados
  if (result.length === 0) {
    throw new Error(`No se encontró un docente con el documento de identidad ${documento_identidad}`);
  }

  // Construir el objeto del profesor
  const profesor = {
    documento_identidad: result[0].documento_identidad,
    nombre: result[0].nombre,
    apellido: result[0].apellido,
    correo: result[0].correo,
    rol: result[0].rol,
    activo: result[0].activo,
    color: result[0].color,
    area_ensenanza: result[0].area_ensenanza,
    materias: [],
  };

  // Agregar las materias al objeto del profesor
  result.forEach((row) => {
    if (row.id_materia) {
      profesor.materias.push({
        id_materia: row.id_materia,
        nombre_materia: row.materia,
      });
    }
  });

  return profesor;
};

// Obtener un estudiante por su ID
const getEstudianteById = async (documento_identidad) => {
  const query = `
    SELECT u.*, e.id_curso, c.nombre AS curso
    FROM Usuario u
    INNER JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
    INNER JOIN Curso c ON e.id_curso = c.id_curso
    LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
    WHERE u.documento_identidad = $1 AND u.rol = 'estudiante' AND u.activo = TRUE;
  `;
  const result = await consultarDB(query, [documento_identidad]);
  return result[0];
};

// Obtener estudiantes por institución
const getEstudiantesPorInstitucion = async (institucion) => {
  const query = `
    SELECT u.*, e.id_curso, c.nombre AS curso
    FROM Usuario u
    INNER JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
    INNER JOIN Curso c ON e.id_curso = c.id_curso
    LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
    WHERE u.id_institucion = $1 AND u.rol = 'estudiante' AND u.activo = TRUE;
  `;
  const result = await consultarDB(query, [institucion]);
  return result;
};

// Obtener estudiantes por profesor
const getEstudiantesPorProfesor = async (documento_profe) => {
  const query = `
    SELECT DISTINCT
      u.documento_identidad AS estudiante_id,
      u.nombre AS estudiante_nombre,
      u.apellido AS estudiante_apellido,
      u.correo AS estudiante_correo,
      u.activo AS estudiante_activo,
      c.id_curso,
      c.nombre AS curso_nombre
    FROM Usuario u
    INNER JOIN Estudiante e ON u.documento_identidad = e.documento_identidad
    INNER JOIN Curso c ON e.id_curso = c.id_curso
    WHERE c.id_curso IN (
      SELECT DISTINCT a.id_curso
      FROM Dictar d
      INNER JOIN Materia m ON d.id_materia = m.id_materia
      INNER JOIN Asignar a ON m.id_materia = a.id_materia
      WHERE d.documento_profe = $1
    )
    AND u.rol = 'estudiante'
    AND u.activo = TRUE
    ORDER BY c.nombre, u.apellido ASC;
  `;
  const result = await consultarDB(query, [documento_profe]);

  return result;
};

//Modelo para actualizar admin
const updateAdmin = async (documento_identidad, nombre, apellido, correo, id_institucion, contraseña) => {
  // Verificar si el correo ya está en uso por otro usuario
  const existingUser = await consultarDB(
    "SELECT * FROM Usuario WHERE correo = $1 AND documento_identidad != $2",
    [correo, documento_identidad]
  );

  if (existingUser.length > 0) {
    throw new Error("El correo ya está en uso por otro usuario");
  }

  let query;
  let values;

  if (contraseña) {
    query = `
      UPDATE Usuario 
      SET nombre = $1, apellido = $2, correo = $3, contraseña = $4, id_institucion = $5
      WHERE documento_identidad = $6 AND rol = 'admin'
      RETURNING *, 
        (SELECT nombre FROM Institucion WHERE id_institucion = $5) AS nombre_institucion,
        (SELECT telefono FROM Institucion WHERE id_institucion = $5) AS telefono_institucion,
        (SELECT instagram FROM Institucion WHERE id_institucion = $5) AS instagram_institucion,
        (SELECT facebook FROM Institucion WHERE id_institucion = $5) AS facebook_institucion,
        (SELECT logo FROM Institucion WHERE id_institucion = $5) AS logo_institucion,
        (SELECT color_principal FROM Institucion WHERE id_institucion = $5) AS color_principal_institucion,
        (SELECT color_secundario FROM Institucion WHERE id_institucion = $5) AS color_secundario_institucion,
        (SELECT fondo FROM Institucion WHERE id_institucion = $5) AS fondo_institucion,
        (SELECT color_pildora1 FROM Institucion WHERE id_institucion = $5) AS color_pildora1_institucion,
        (SELECT color_pildora2 FROM Institucion WHERE id_institucion = $5) AS color_pildora2_institucion,
        (SELECT color_pildora3 FROM Institucion WHERE id_institucion = $5) AS color_pildora3_institucion,
        (SELECT estado FROM Institucion WHERE id_institucion = $5) AS estado_institucion,
        (SELECT direccion FROM Institucion WHERE id_institucion = $5) AS direccion_institucion;
    `;
    values = [nombre, apellido, correo, contraseña, id_institucion, documento_identidad];
  } else {
    query = `
      UPDATE Usuario 
      SET nombre = $1, apellido = $2, correo = $3, id_institucion = $4
      WHERE documento_identidad = $5 AND rol = 'admin'
      RETURNING *, 
        (SELECT nombre FROM Institucion WHERE id_institucion = $4) AS nombre_institucion,
        (SELECT telefono FROM Institucion WHERE id_institucion = $4) AS telefono_institucion,
        (SELECT instagram FROM Institucion WHERE id_institucion = $4) AS instagram_institucion,
        (SELECT facebook FROM Institucion WHERE id_institucion = $4) AS facebook_institucion,
        (SELECT logo FROM Institucion WHERE id_institucion = $4) AS logo_institucion,
        (SELECT color_principal FROM Institucion WHERE id_institucion = $4) AS color_principal_institucion,
        (SELECT color_secundario FROM Institucion WHERE id_institucion = $4) AS color_secundario_institucion,
        (SELECT fondo FROM Institucion WHERE id_institucion = $4) AS fondo_institucion,
        (SELECT color_pildora1 FROM Institucion WHERE id_institucion = $4) AS color_pildora1_institucion,
        (SELECT color_pildora2 FROM Institucion WHERE id_institucion = $4) AS color_pildora2_institucion,
        (SELECT color_pildora3 FROM Institucion WHERE id_institucion = $4) AS color_pildora3_institucion,
        (SELECT estado FROM Institucion WHERE id_institucion = $4) AS estado_institucion,
        (SELECT direccion FROM Institucion WHERE id_institucion = $4) AS direccion_institucion;
    `;
    values = [nombre, apellido, correo, id_institucion, documento_identidad];
  }

  const result = await consultarDB(query, values);
  return result[0];
};

// Modelo para actualizar un profesor
const updateProfesor = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  id_institucion,
  area_ensenanza
) => {
  // Verificar si el correo ya está en uso por otro usuario
  const existingUser = await consultarDB(
    "SELECT * FROM Usuario WHERE correo = $1 AND documento_identidad != $2",
    [correo, documento_identidad]
  );

  if (existingUser.length > 0) {
    throw new Error("El correo ya está en uso por otro usuario");
  }

  let query;
  let values;

  if (contraseña) {
    query = `
      UPDATE Usuario 
      SET nombre = $1, apellido = $2, correo = $3, contraseña = $4, id_institucion = $5
      WHERE documento_identidad = $6
      RETURNING *;
    `;
    values = [nombre, apellido, correo, contraseña, id_institucion, documento_identidad];
  } else {
    query = `
      UPDATE Usuario 
      SET nombre = $1, apellido = $2, correo = $3, id_institucion = $4
      WHERE documento_identidad = $5
      RETURNING *;
    `;
    values = [nombre, apellido, correo, id_institucion, documento_identidad];
  }

  const result = await consultarDB(query, values);

  // Actualizar el área de enseñanza en la tabla Profesor
  const queryProfesor = `
    UPDATE Profesor 
    SET area_ensenanza = $1 
    WHERE documento_identidad = $2
    RETURNING *;
  `;

  const resultProfesor = await consultarDB(queryProfesor, [
    area_ensenanza,
    documento_identidad,
  ]);

  // Combinar los resultados de las dos consultas
  const updatedProfesor = {
    ...result[0],
    area_ensenanza: resultProfesor[0].area_ensenanza,
  };

  return updatedProfesor;
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
  // Verificar si el correo ya está en uso por otro usuario
  const existingUser = await consultarDB(
    "SELECT * FROM Usuario WHERE correo = $1 AND documento_identidad != $2",
    [correo, documento_identidad]
  );

  if (existingUser.length > 0) {
    throw new Error("El correo ya está en uso por otro usuario");
  }

  let query;
  let values;

  if (contraseña) {
    query = `
      UPDATE Usuario 
      SET nombre = $1, apellido = $2, correo = $3, contraseña = $4, id_institucion = $5
      WHERE documento_identidad = $6
      RETURNING *;
    `;
    values = [nombre, apellido, correo, contraseña, institucion, documento_identidad];
  } else {
    query = `
      UPDATE Usuario 
      SET nombre = $1, apellido = $2, correo = $3, id_institucion = $4
      WHERE documento_identidad = $5
      RETURNING *;
    `;
    values = [nombre, apellido, correo, institucion, documento_identidad];
  }

  const result = await consultarDB(query, values);

  // Actualizar el curso del estudiante en la tabla Estudiante
  const queryEstudiante = `
    UPDATE Estudiante 
    SET id_curso = $1 
    WHERE documento_identidad = $2
    RETURNING *;
  `;

  const resultEstudiante = await consultarDB(queryEstudiante, [
    id_curso,
    documento_identidad,
  ]);

  return result[0];
};

// Obtener docentes por institución
const getDocentesPorInstitucion = async (institucion) => {
  const query = `
    SELECT u.*, p.area_ensenanza, m.id_materia, m.nombre AS materia
    FROM Usuario u
    INNER JOIN Profesor p ON u.documento_identidad = p.documento_identidad
    LEFT JOIN Dictar d ON p.documento_identidad = d.documento_profe
    LEFT JOIN Materia m ON d.id_materia = m.id_materia
    LEFT JOIN Institucion i ON u.id_institucion = i.id_institucion
    WHERE u.id_institucion = $1 AND u.rol = 'docente' AND u.activo = TRUE AND d.estado = TRUE;
  `;
  const result = await consultarDB(query, [institucion]);

  const profesores = {};
  result.forEach((row) => {
    if (!profesores[row.documento_identidad]) {
      profesores[row.documento_identidad] = {
        documento_identidad: row.documento_identidad,
        nombre: row.nombre,
        apellido: row.apellido,
        correo: row.correo,
        rol: row.rol,
        institucion: row.institucion,
        activo: row.activo,
        color: row.color,
        area_ensenanza: row.area_ensenanza,
        materias: [],
      };
    }
    if (row.id_materia) {
      profesores[row.documento_identidad].materias.push({
        id_materia: row.id_materia,
        nombre_materia: row.materia,
      });
    }
  });

  return Object.values(profesores);
};

module.exports = {
  ExistingUser,
  insertUsuario,
  insertProfesor,
  insertEstudiante,
  getUsuarioByDocumento,
  getUsuariosActivos,
  updateUsuario,
  desactivarUsuario,
  activarUsuario,
  getUsuariosByRol,
  updateAdmin,
  updateEstudiante,
  updateProfesor,
  getEstudiantesPorInstitucion,
  getEstudiantesPorProfesor,
  getProfesorById,
  getEstudianteById,
  getDocentesPorInstitucion,
};