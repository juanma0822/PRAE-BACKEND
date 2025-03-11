const periodoAcademicoModel = require('../models/periodoAcademico.model');

// Crear un nuevo periodo académico
const createPeriodoAcademico = async (nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion) => {
  try {
    const periodoAcademico = await periodoAcademicoModel.insertPeriodoAcademico(nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion);
    return periodoAcademico;
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

module.exports = {
  createPeriodoAcademico,
  getAllPeriodosAcademicos,
  getPeriodoAcademicoById,
  getPeriodosAcademicosByInstitucion,
  getPeriodosAcademicosByAnioEInstitucion,
  updatePeriodoAcademico,
  deletePeriodoAcademico,
};