const asignarService = require('../services/asignar.service');

const asignarMateria = async (req, res) => {
    try {
        const { id_curso, id_materia } = req.body;
        const resultado = await asignarService.asignarMateria(id_curso, id_materia);
        res.status(201).json({ message: 'Materia asignada con éxito', resultado });
    } catch (error) {
        console.error('Error al asignar materia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerMateriasPorCurso = async (req, res) => {
    try {
        const { id_curso } = req.params;
        const resultado = await asignarService.obtenerMateriasPorCurso(id_curso);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener materias por curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const eliminarAsignacion = async (req, res) => {
    try {
        const { id_asignacion } = req.params;
        await asignarService.eliminarAsignacion(id_asignacion);
        res.status(200).json({ message: 'Asignación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar asignación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { asignarMateria, obtenerMateriasPorCurso, eliminarAsignacion };
