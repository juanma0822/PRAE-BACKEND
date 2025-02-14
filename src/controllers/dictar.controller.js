const dictarService = require('../services/dictar.service');

// Crear una relación Dictar
const createDictar = async (req, res) => {
  try {
    const { documento_profe, id_materia } = req.body;
    const nuevaDictar = await dictarService.createDictar(documento_profe, id_materia);
    res.status(201).json(nuevaDictar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las relaciones Dictar
const getAllDictar = async (req, res) => {
  try {
    const dictar = await dictarService.getAllDictar();
    res.status(200).json(dictar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener las materias que dicta un profesor
const getMateriasPorProfesor = async (req, res) => {
  try {
    const { documento_profe } = req.params;
    const materias = await dictarService.getMateriasPorProfesor(documento_profe);
    res.status(200).json(materias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener los profesores que dictan una materia
const getProfesoresPorMateria = async (req, res) => {
  try {
    const { id_materia } = req.params;
    const profesores = await dictarService.getProfesoresPorMateria(id_materia);
    res.status(200).json(profesores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una relación Dictar
const deleteDictar = async (req, res) => {
  try {
    const { id_materiadictada } = req.params;
    const resultado = await dictarService.deleteDictar(id_materiadictada);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDictar,
  getAllDictar,
  getMateriasPorProfesor,
  getProfesoresPorMateria,
  deleteDictar,
};