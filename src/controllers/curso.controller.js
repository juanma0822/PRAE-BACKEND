const cursoService = require('../services/curso.service');

const {
    emitirEstadisticasInstitucion,
} = require('../sockets/emitStats');


const getCursos = async (req, res) => {
    try {
        const cursos = await cursoService.getCursos();
        res.status(200).json(cursos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCursoById = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await cursoService.getCursoById(id);
        if (!curso) return res.status(404).json({ message: "Curso no encontrado" });
        res.status(200).json(curso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCurso = async (req, res) => {
    try {
        const { nombre, id_institucion } = req.body;
        const nuevoCurso = await cursoService.createCurso(nombre, id_institucion);
        await emitirEstadisticasInstitucion(id_institucion);

        res.status(201).json(nuevoCurso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, id_institucion } = req.body;
        const cursoActualizado = await cursoService.updateCurso(id, nombre, id_institucion);
        if (!cursoActualizado) return res.status(404).json({ message: "Curso no encontrado" });
        res.status(200).json({ message: "Curso actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await cursoService.deleteCurso(id);
        if (eliminado.length === 0) return res.status(404).json({ message: "Curso no encontrado" });
        
        const id_institucion = eliminado[0].id_institucion;

        // Emitir el cambio de la institución después de la eliminación
        await emitirEstadisticasInstitucion(id_institucion);

        res.status(200).json({ message: "Curso eliminado correctamente (estado inactivo)" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const activateCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const activado = await cursoService.activateCurso(id);
        if (!activado) return res.status(404).json({ message: "Curso no encontrado" });
        
        const id_institucion = activado.id_institucion;
        // Emitir el cambio de la institución después de la activación
        await emitirEstadisticasInstitucion(id_institucion);

        res.status(200).json({ message: "Curso activado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getIdByName = async (req, res) => {
    try {
        const { nombre } = req.params;
        const curso = await cursoService.findCursoByName(nombre);
        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }
        res.status(200).json({ id_curso: curso.id_curso });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

const getEstudiantesPorCurso = async (req, res) => {
    const { id_curso } = req.params;
    try {
        const estudiantes = await cursoService.obtenerEstudiantesPorCurso(id_curso);
        res.status(200).json(estudiantes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los estudiantes');
    }
};

const getCursosByInstitucion = async (req, res) => {
    try {
        const { id_institucion } = req.params;
        const cursos = await cursoService.getCursosByInstitucion(id_institucion);
        res.status(200).json(cursos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCursos,
    getCursoById,
    createCurso,
    updateCurso,
    deleteCurso,
    activateCurso,
    getIdByName,
    getEstudiantesPorCurso,
    getCursosByInstitucion,
};