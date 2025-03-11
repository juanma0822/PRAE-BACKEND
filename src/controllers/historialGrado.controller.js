const historialGradoService = require('../services/historialGrado.service');

// Crear un nuevo historial de grado
const createHistorialGrado = async (req, res) => {
  try {
    const { id_estudiante, id_curso, id_periodo, anio } = req.body;
    const nuevoHistorialGrado = await historialGradoService.createHistorialGrado(id_estudiante, id_curso, id_periodo, anio);
    res.status(201).json(nuevoHistorialGrado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los historiales de grado activos
const getAllHistorialesGrado = async (req, res) => {
  try {
    const historialesGrado = await historialGradoService.getAllHistorialesGrado();
    res.status(200).json(historialesGrado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener el historial de grado de un estudiante por año
const getHistorialGradoByEstudianteAnio = async (req, res) => {
  try {
    const { id_estudiante, anio } = req.body;
    const historialGrado = await historialGradoService.getHistorialGradoByEstudianteAnio(id_estudiante, anio);
    res.status(200).json(historialGrado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los historiales de grado de una institución específica
const getHistorialesGradoByInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const historialesGrado = await historialGradoService.getHistorialesGradoByInstitucion(id_institucion);
    res.status(200).json(historialesGrado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener el historial completo de un estudiante
const getHistorialCompletoByEstudiante = async (req, res) => {
    try {
      const { id_estudiante } = req.params;
      const historialCompleto = await historialGradoService.getHistorialCompletoByEstudiante(id_estudiante);
      res.status(200).json(historialCompleto);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Actualizar un historial de grado
const updateHistorialGrado = async (req, res) => {
  try {
    const { id_historial } = req.params;
    const { id_estudiante, id_curso, id_periodo, anio } = req.body;
    const historialGradoActualizado = await historialGradoService.updateHistorialGrado(id_historial, id_estudiante, id_curso, id_periodo, anio);
    res.status(200).json(historialGradoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Desactivar un historial de grado (cambiar estado a false)
const deleteHistorialGrado = async (req, res) => {
  try {
    const { id_historial } = req.params;
    const resultado = await historialGradoService.deleteHistorialGrado(id_historial);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
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