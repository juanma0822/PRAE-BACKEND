const usuarioService = require('../services/usuario.service');

const createAdmin = async (req, res) => {
    try {
        const { documento_identidad, nombre, apellido, correo, contraseña, institucion } = req.body;
        const newAdmin = await usuarioService.addUsuario(documento_identidad, nombre, apellido, correo, contraseña, 'admin', institucion);
        res.status(201).json(newAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el administrador');
    }
};

const createProfesor = async (req, res) => {
    try {
        const { documento_identidad, nombre, apellido, correo, contraseña, institucion, area_ensenanza, id_materia } = req.body;
        const newProfesor = await usuarioService.addProfesor(documento_identidad, nombre, apellido, correo, contraseña, institucion, area_ensenanza, id_materia);
        res.status(201).json(newProfesor);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el profesor');
    }
};

const createEstudiante = async (req, res) => {
    try {
        const { documento_identidad, nombre, apellido, correo, contraseña, institucion, id_curso } = req.body;
        const newEstudiante = await usuarioService.addEstudiante(documento_identidad, nombre, apellido, correo, contraseña, institucion, id_curso);
        res.status(201).json(newEstudiante);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el estudiante');
    }
};

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.getAllUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo, rol, institucion } = req.body;
        const updatedUser = await usuarioService.updateUsuario(id, nombre, apellido, correo, rol, institucion);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await usuarioService.deleteUsuario(id);
        res.status(200).send('Usuario desactivado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

const activarUsuario = async (req, res) => {
    try {
        const { documento_identidad } = req.params;
        const usuarioActivado = await usuarioService.activarUsuario(documento_identidad);
        res.status(200).json({ message: 'Usuario activado correctamente', usuario: usuarioActivado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdmins = async (req, res) => {
    try {
        const admins = await usuarioService.getUsuariosByRol('admin');
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDocentes = async (req, res) => {
    try {
        const docentes = await usuarioService.getUsuariosByRol('docente');
        res.status(200).json(docentes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await usuarioService.getUsuariosByRol('estudiante');
        res.status(200).json(estudiantes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar datos de un profesor
const updateProfesor = async (req, res) => {
    try {
        const { documento_identidad } = req.params;
        const { nombre, apellido, correo, contraseña, institucion, area_ensenanza } = req.body;
        
        const usuarioActualizado = await usuarioService.updateProfesor(
            documento_identidad, nombre, apellido, correo, contraseña, institucion, area_ensenanza
        );

        res.status(200).json({ message: 'Profesor actualizado con éxito', usuarioActualizado });
    } catch (error) {
        console.error('Error al actualizar el profesor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar datos de un estudiante
const updateEstudiante = async (req, res) => {
    try {
        const { documento_identidad } = req.params;
        const { nombre, apellido, correo, contraseña, institucion, id_curso } = req.body;

        const usuarioActualizado = await usuarioService.updateEstudiante(
            documento_identidad, nombre, apellido, correo, contraseña, institucion, id_curso
        );

        res.status(200).json({ message: 'Estudiante actualizado con éxito', usuarioActualizado });
    } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { createAdmin, createProfesor, createEstudiante, getUsuarios, updateUsuario, deleteUsuario, activarUsuario, getAdmins, getDocentes, getEstudiantes, updateEstudiante, updateProfesor };
