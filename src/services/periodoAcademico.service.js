const periodoAcademicoModel = require('../models/periodoAcademico.model');

// Crear un nuevo periodo académico con validaciones
const createPeriodoAcademico = async (nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion) => {
  try {
    const añoActual = new Date().getFullYear();

    // Validar que el año no sea pasado
    if (anio < añoActual) {
      throw new Error('El año del periodo académico no puede ser menor al año actual');
    }

    // Validar que las fechas no se superpongan con otros periodos
    const periodosExistentes = await periodoAcademicoModel.getPeriodosAcademicosByInstitucion(id_institucion);
    for (const periodo of periodosExistentes) {
      const inicioExistente = new Date(periodo.fecha_inicio);
      const finExistente = new Date(periodo.fecha_fin);
      const nuevoInicio = new Date(fecha_inicio);
      const nuevoFin = new Date(fecha_fin);

      if (
        (nuevoInicio >= inicioExistente && nuevoInicio <= finExistente) || // Nuevo inicio dentro de un periodo existente
        (nuevoFin >= inicioExistente && nuevoFin <= finExistente) || // Nuevo fin dentro de un periodo existente
        (nuevoInicio <= inicioExistente && nuevoFin >= finExistente) // Nuevo periodo abarca un periodo existente
      ) {
        throw new Error(
          `El nuevo periodo académico se superpone con el periodo existente: ${periodo.nombre} (${periodo.fecha_inicio} - ${periodo.fecha_fin})`
        );
      }
    }

    // Crear el nuevo periodo académico
    const nuevoPeriodo = await periodoAcademicoModel.createPeriodoAcademico(
      nombre,
      anio,
      fecha_inicio,
      fecha_fin,
      peso,
      id_institucion
    );

    return nuevoPeriodo;
  } catch (error) {
    throw new Error(`Error al crear el periodo académico: ${error.message}`);
  }
};

// Obtener todos los periodos académicos activos
const getAllPeriodosAcademicos = async () => {
  try {
    const periodosAcademicos = await periodoAcademicoModel.getAllPeriodosAcademicos();
    return periodosAcademicos;
  } catch (error) {
    throw new Error(`Error al obtener los periodos académicos: ${error.message}`);
  }
};

// Obtener un periodo académico por su ID
const getPeriodoAcademicoById = async (id_periodo) => {
  try {
    const periodoAcademico = await periodoAcademicoModel.getPeriodoAcademicoById(id_periodo);
    if (!periodoAcademico) throw new Error('Periodo académico no encontrado');
    return periodoAcademico;
  } catch (error) {
    throw new Error(`Error al obtener el periodo académico: ${error.message}`);
  }
};

// Obtener periodos académicos por institución
const getPeriodosAcademicosByInstitucion = async (id_institucion) => {
  try {
    const periodosAcademicos = await periodoAcademicoModel.getPeriodosAcademicosByInstitucion(id_institucion);
    return periodosAcademicos;
  } catch (error) {
    throw new Error(`Error al obtener los periodos académicos por institución: ${error.message}`);
  }
};

// Obtener periodos académicos por año e institución
const getPeriodosAcademicosByAnioEInstitucion = async (anio, id_institucion) => {
  try {
    const periodosAcademicos = await periodoAcademicoModel.getPeriodosAcademicosByAnioEInstitucion(anio, id_institucion);
    return periodosAcademicos;
  } catch (error) {
    throw new Error(`Error al obtener los periodos académicos por año e institución: ${error.message}`);
  }
};

// Actualizar un periodo académico
const updatePeriodoAcademico = async (id_periodo, nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion) => {
  try {
    const periodoAcademico = await periodoAcademicoModel.updatePeriodoAcademico(id_periodo, nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion);
    if (!periodoAcademico) throw new Error('Periodo académico no encontrado');
    return periodoAcademico;
  } catch (error) {
    throw new Error(`Error al actualizar el periodo académico: ${error.message}`);
  }
};

// Desactivar un periodo académico (cambiar estado a false)
const deletePeriodoAcademico = async (id_periodo) => {
  try {
    const periodoAcademico = await periodoAcademicoModel.deletePeriodoAcademico(id_periodo);
    if (!periodoAcademico) throw new Error('Periodo académico no encontrado');
    return { message: 'Periodo académico desactivado correctamente', periodoAcademico };
  } catch (error) {
    throw new Error(`Error al desactivar el periodo académico: ${error.message}`);
  }
};

// Obtener el periodo activo de una institución
const getPeriodoActivoByInstitucion = async (id_institucion) => {
  try {
    const periodoActivo = await periodoAcademicoModel.getPeriodoActivoByInstitucion(id_institucion);
    if (!periodoActivo) throw new Error('No hay un periodo activo para esta institución');
    return periodoActivo;
  } catch (error) {
    throw new Error(`Error al obtener el periodo activo: ${error.message}`);
  }
};

// Activar un periodo y desactivar los demás de la institución
const activatePeriodoAcademico = async (id_periodo, id_institucion) => {
  try {
    const periodoActivado = await periodoAcademicoModel.activatePeriodoAcademico(id_periodo, id_institucion);
    if (!periodoActivado) throw new Error('No se pudo activar el periodo académico');
    return periodoActivado;
  } catch (error) {
    throw new Error(`Error al activar el periodo académico: ${error.message}`);
  }
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