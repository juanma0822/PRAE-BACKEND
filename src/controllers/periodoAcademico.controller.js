const periodoAcademicoService = require('../services/periodoAcademico.service');

// Crear un nuevo periodo académico
const createPeriodoAcademico = async (req, res) => {
  try {
    const { nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion } = req.body;
    const nuevoPeriodoAcademico = await periodoAcademicoService.createPeriodoAcademico(nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion);
    res.status(201).json(nuevoPeriodoAcademico);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los periodos académicos activos
const getAllPeriodosAcademicos = async (req, res) => {
  try {
    const periodosAcademicos = await periodoAcademicoService.getAllPeriodosAcademicos();
    res.status(200).json(periodosAcademicos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un periodo académico por su ID
const getPeriodoAcademicoById = async (req, res) => {
  try {
    const { id_periodo } = req.params;
    const periodoAcademico = await periodoAcademicoService.getPeriodoAcademicoById(id_periodo);
    res.status(200).json(periodoAcademico);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener periodos académicos por institución
const getPeriodosAcademicosByInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const periodosAcademicos = await periodoAcademicoService.getPeriodosAcademicosByInstitucion(id_institucion);
    res.status(200).json(periodosAcademicos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener periodos académicos por año e institución
const getPeriodosAcademicosByAnioEInstitucion = async (req, res) => {
  try {
    const { anio, id_institucion } = req.body;
    const periodosAcademicos = await periodoAcademicoService.getPeriodosAcademicosByAnioEInstitucion(anio, id_institucion);
    res.status(200).json(periodosAcademicos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un periodo académico
const updatePeriodoAcademico = async (req, res) => {
  try {
    const { id_periodo } = req.params;
    const { nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion } = req.body;
    const periodoAcademicoActualizado = await periodoAcademicoService.updatePeriodoAcademico(id_periodo, nombre, anio, fecha_inicio, fecha_fin, peso, id_institucion);
    res.status(200).json(periodoAcademicoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Desactivar un periodo académico (cambiar estado a false)
const deletePeriodoAcademico = async (req, res) => {
  try {
    const { id_periodo } = req.params;
    const resultado = await periodoAcademicoService.deletePeriodoAcademico(id_periodo);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
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