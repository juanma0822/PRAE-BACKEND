const { consultarDB } = require('../db');

// Crear un nuevo periodo académico
const createPeriodoAcademico = async (nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion) => {
  const query = `
    INSERT INTO PeriodoAcademico (nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion, estado)
    VALUES ($1, $2, $3, $4, $5, $6, TRUE)
    RETURNING *;
  `;
  const values = [nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion];
  const result = await consultarDB(query, values);
  return result[0];
};

// Obtener todos los periodos académicos activos
const getAllPeriodosAcademicos = async () => {
  const query = `
    SELECT * FROM PeriodoAcademico
    WHERE estado = TRUE;
  `;
  const result = await consultarDB(query);
  return result;
};

// Obtener un periodo académico por su ID
const getPeriodoAcademicoById = async (id_periodo) => {
  const query = `
    SELECT * FROM PeriodoAcademico
    WHERE id_periodo = $1 AND estado = TRUE;
  `;
  const result = await consultarDB(query, [id_periodo]);
  return result[0];
};

// Obtener periodos académicos por institución
const getPeriodosAcademicosByInstitucion = async (id_institucion) => {
  const query = `
    SELECT * FROM PeriodoAcademico
    WHERE id_institucion = $1 AND estado = TRUE;
  `;
  const result = await consultarDB(query, [id_institucion]);
  return result;
};

// Obtener periodos académicos por año e institución
const getPeriodosAcademicosByAnioEInstitucion = async (anio, id_institucion) => {
  const query = `
    SELECT * FROM PeriodoAcademico
    WHERE anio = $1 AND id_institucion = $2
    ORDER BY fecha_inicio ASC; -- Ordenar por fecha de inicio en orden ascendente
  `;
  const result = await consultarDB(query, [anio, id_institucion]);

  // Formatear las fechas a 'YYYY-MM-DD' y convertir el peso a entero
  return result.map((periodo) => ({
    ...periodo,
    fecha_inicio: new Date(periodo.fecha_inicio).toISOString().split('T')[0],
    fecha_fin: new Date(periodo.fecha_fin).toISOString().split('T')[0],
    peso: parseInt(periodo.peso, 10), // Convertir el peso a entero
  }));
};

// Actualizar un periodo académico
const updatePeriodoAcademico = async (id_periodo, nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion) => {
  // Verificar si el periodo está bloqueado
  const verificarBloqueadoQuery = `
    SELECT bloqueado 
    FROM PeriodoAcademico
    WHERE id_periodo = $1;
  `;
  const verificarBloqueadoResult = await consultarDB(verificarBloqueadoQuery, [id_periodo]);

  if (verificarBloqueadoResult[0]?.bloqueado) {
    throw new Error("Este periodo académico ya fue bloqueado y no puede ser modificado.");
  }

  // Permitir la actualización si no está bloqueado
  const query = `
    UPDATE PeriodoAcademico
    SET 
      nombre = $1, 
      anio = $2, 
      fecha_inicio = $3, 
      fecha_fin = $4, 
      peso = $5, 
      id_institucion = $6,
      bloqueado = TRUE -- Bloquear el periodo después de la actualización
    WHERE id_periodo = $7
    RETURNING *;
  `;
  const values = [nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion, id_periodo];
  const result = await consultarDB(query, values);

  // Verificar y actualizar el estado de los periodos del mismo año
  const actualizarEstadoQuery = `
    UPDATE PeriodoAcademico
    SET estado = CASE
      WHEN CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin THEN TRUE
      ELSE FALSE
    END
    WHERE anio = $1 AND id_institucion = $2;
  `;
  await consultarDB(actualizarEstadoQuery, [anio, id_institucion]);

  return result[0];
};

// Desactivar un periodo académico (cambiar estado a false)
const deletePeriodoAcademico = async (id_periodo) => {
  const query = `
    UPDATE PeriodoAcademico
    SET estado = FALSE
    WHERE id_periodo = $1
    RETURNING *;
  `;
  const result = await consultarDB(query, [id_periodo]);
  return result[0];
};

// Obtener el periodo activo de una institución
const getPeriodoActivoByInstitucion = async (id_institucion) => {
  const query = `
    SELECT * FROM PeriodoAcademico
    WHERE id_institucion = $1 AND estado = TRUE
    LIMIT 1;
  `;
  const result = await consultarDB(query, [id_institucion]);
  return result[0];
};

// Activar un periodo y desactivar los demás de la institución
const activatePeriodoAcademico = async (id_periodo, id_institucion) => {
  const queryDesactivar = `
    UPDATE PeriodoAcademico
    SET estado = FALSE
    WHERE id_institucion = $1;
  `;
  const queryActivar = `
    UPDATE PeriodoAcademico
    SET estado = TRUE
    WHERE id_periodo = $1
    RETURNING *;
  `;
  await consultarDB(queryDesactivar, [id_institucion]); // Desactivar todos los periodos
  const result = await consultarDB(queryActivar, [id_periodo]); // Activar el periodo seleccionado
  return result[0];
};

module.exports = {
  createPeriodoAcademico,
  getAllPeriodosAcademicos,
  getPeriodoAcademicoById,
  getPeriodosAcademicosByInstitucion,
  getPeriodosAcademicosByAnioEInstitucion,
  updatePeriodoAcademico,
  deletePeriodoAcademico,
  getPeriodoActivoByInstitucion,
  activatePeriodoAcademico,
};