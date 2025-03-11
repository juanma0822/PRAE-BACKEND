const historialGradoModel = require('../models/historialGrado.model');

// Crear un nuevo historial de grado
const createHistorialGrado = async (id_estudiante, id_curso, id_periodo, anio) => {
  try {
    const historialGrado = await historialGradoModel.insertHistorialGrado(id_estudiante, id_curso, id_periodo, anio);
    return historialGrado;
  } catch (error) {
    throw new Error(`Error al crear el historial de grado: ${error.message}`);
  }
};

// Obtener todos los historiales de grado activos
const getAllHistorialesGrado = async () => {
  try {
    const historialesGrado = await historialGradoModel.getAllHistorialesGrado();
    return historialesGrado;
  } catch (error) {
    throw new Error(`Error al obtener los historiales de grado: ${error.message}`);
  }
};

// Obtener el historial de grado de un estudiante por año
const getHistorialGradoByEstudianteAnio = async (id_estudiante, anio) => {
  try {
    const historialGrado = await historialGradoModel.getHistorialGradoByEstudianteAnio(id_estudiante, anio);
    return historialGrado;
  } catch (error) {
    throw new Error(`Error al obtener el historial de grado del estudiante: ${error.message}`);
  }
};

// Obtener todos los historiales de grado de una institución específica
const getHistorialesGradoByInstitucion = async (id_institucion) => {
  try {
    const historialesGrado = await historialGradoModel.getHistorialesGradoByInstitucion(id_institucion);
    return historialesGrado;
  } catch (error) {
    throw new Error(`Error al obtener los historiales de grado de la institución: ${error.message}`);
  }
};

// Obtener el historial completo de un estudiante
const getHistorialCompletoByEstudiante = async (id_estudiante) => {
    try {
      const historialCompleto = await historialGradoModel.getHistorialCompletoByEstudiante(id_estudiante);
      return historialCompleto;
    } catch (error) {
      throw new Error(`Error al obtener el historial completo del estudiante: ${error.message}`);
    }
  };

// Actualizar un historial de grado
const updateHistorialGrado = async (id_historial, id_estudiante, id_curso, id_periodo, anio) => {
  try {
    const historialGrado = await historialGradoModel.updateHistorialGrado(id_historial, id_estudiante, id_curso, id_periodo, anio);
    if (!historialGrado) throw new Error('Historial de grado no encontrado');
    return historialGrado;
  } catch (error) {
    throw new Error(`Error al actualizar el historial de grado: ${error.message}`);
  }
};

// Desactivar un historial de grado (cambiar estado a false)
const deleteHistorialGrado = async (id_historial) => {
  try {
    const historialGrado = await historialGradoModel.deleteHistorialGrado(id_historial);
    if (!historialGrado) throw new Error('Historial de grado no encontrado');
    return { message: 'Historial de grado desactivado correctamente', historialGrado };
  } catch (error) {
    throw new Error(`Error al desactivar el historial de grado: ${error.message}`);
  }
};

module.exports = {
  createHistorialGrado,
  getAllHistorialesGrado,
  getHistorialGradoByEstudianteAnio,
  getHistorialesGradoByInstitucion,
  getHistorialCompletoByEstudiante,
  updateHistorialGrado,
  deleteHistorialGrado,
};