const materiaService = require('../services/materia.service');

// Crear una materia
const addMateria = async (req, res) => {
  try {
    const { nombre, id_institucion } = req.body;

    if (!nombre || !id_institucion) {
      return res.status(400).json({ message: "El nombre y la institución son requeridos y no pueden estar vacíos" });
    }

    const nuevaMateria = await materiaService.addMateria(nombre, id_institucion);
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
    const { id_institucion } = req.params;

    if (!id_institucion) {
        return res.status(400).json({ message: "Institución es requerida" });
    }

    const materias = await materiaService.getMateriasByInstitucion(id_institucion);
    res.status(200).json(materias);
} catch (error) {
    console.error("Error al obtener materias:", error);
    res.status(500).json({ message: error.message });
}
};

// Obtener todas las materias con los profesores que se dan de una institución específica
const getMateriasConDocentes = async (req, res) => {
  try {
    const { id_institucion } = req.params;

    if (!id_institucion) {
      return res.status(400).json({ message: "El ID de la institución es requerido" });
    }

    const materiasConDocentes = await materiaService.getMateriasConDocentes(id_institucion);
    res.status(200).json(materiasConDocentes);
  } catch (error) {
    console.error("Error al obtener materias con docentes:", error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una materia
const updateMateria = async (req, res) => {
  try {
    const { id_materia } = req.params;
    const { nombre, id_institucion } = req.body;
    const materiaActualizada = await materiaService.updateMateria(id_materia, nombre, id_institucion);
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
  getMateriasConDocentes,
  updateMateria,
  deleteMateria,
  activateMateria,
};