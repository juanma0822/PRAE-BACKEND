const materiaService = require('../services/materia.service');

// Crear una materia
const addMateria = async (req, res) => {
  try {
    const { nombre, color, institucion } = req.body;
    const nuevaMateria = await materiaService.addMateria(nombre, color, institucion);
    res.status(201).json(nuevaMateria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una materia por su ID
const getMateriaById = async (req, res) => {
  try {
    const { id_materia } = req.params;
    const materia = await materiaService.getMateriaById(id_materia);
    res.status(200).json(materia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las materias activas
const getAllMaterias = async (req, res) => {
  try {
    const materias = await materiaService.getAllMaterias();
    res.status(200).json(materias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las materias de una institución específica
const getMateriasByInstitucion = async (req, res) => {
  try {
    const { institucion } = req.params;

    if (!institucion) {
        return res.status(400).json({ message: "Institución es requerida" });
    }

    const materias = await materiaService.getMateriasByInstitucion(institucion);
    res.status(200).json(materias);
} catch (error) {
    console.error("Error al obtener materias:", error);
    res.status(500).json({ message: error.message });
}
};

// Actualizar una materia
const updateMateria = async (req, res) => {
  try {
    const { id_materia } = req.params;
    const { nombre, institucion } = req.body;
    const materiaActualizada = await materiaService.updateMateria(id_materia, nombre, institucion);
    res.status(200).json(materiaActualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Desactivar una materia
const deleteMateria = async (req, res) => {
  try {
    const { id_materia } = req.params;
    const resultado = await materiaService.deleteMateria(id_materia);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activar una materia
const activateMateria = async (req, res) => {
  try {
    const { id_materia } = req.params;
    const materiaActivada = await materiaService.activateMateria(id_materia);
    res.status(200).json(materiaActivada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMateria,
  getMateriaById,
  getAllMaterias,
  getMateriasByInstitucion,
  updateMateria,
  deleteMateria,
  activateMateria,
};