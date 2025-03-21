const usuarioService = require("../services/usuario.service");

const createAdmin = async (req, res) => {
  try {
    const {
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
    } = req.body;
    const newAdmin = await usuarioService.addUsuario(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      "admin",
      id_institucion
    );
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createProfesor = async (req, res) => {
  try {
    const {
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      area_ensenanza,
    } = req.body;
    const newProfesor = await usuarioService.addProfesor(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      area_ensenanza
    );
    res.status(201).json(newProfesor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createEstudiante = async (req, res) => {
  try {
    const {
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      id_curso,
    } = req.body;
    const newEstudiante = await usuarioService.addEstudiante(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      id_curso
    );
    res.status(201).json(newEstudiante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, rol, id_institucion, contraseña } = req.body;
    const updatedUser = await usuarioService.updateUsuario(
      id,
      nombre,
      apellido,
      correo,
      contraseña,
      rol,
      id_institucion
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor: " + error.message });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await usuarioService.deleteUsuario(id);
    res.status(200).send("Usuario desactivado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor: " + error.message });
  }
};

const activarUsuario = async (req, res) => {
  try {
    const { documento_identidad } = req.params;
    const usuarioActivado = await usuarioService.activarUsuario(
      documento_identidad
    );
    res
      .status(200)
      .json({
        message: "Usuario activado correctamente",
        usuario: usuarioActivado,
      });
  } catch (error) {
    res.status(500).json({ error: "Error al activar el usuario: " + error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await usuarioService.getUsuariosByRol("admin");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener administradores: " + error.message });
  }
};

const getDocentes = async (req, res) => {
  try {
    const docentes = await usuarioService.getUsuariosByRol("docente");
    res.status(200).json(docentes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener docentes: " + error.message });
  }
};

const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await usuarioService.getUsuariosByRol("estudiante");
    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiantes: " + error.message });
  }
};

// Obtener estudiantes por institución
const getEstudiantesPorInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const estudiantes = await usuarioService.getEstudiantesPorInstitucion(
      id_institucion
    );
    res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error al obtener estudiantes por institución:", error);
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};

// Obtener estudiantes por profesor
const getEstudiantesPorProfesor = async (req, res) => {
  try {
    const { documento_profe } = req.params;
    const estudiantes = await usuarioService.getEstudiantesPorProfesor(
      documento_profe
    );
    res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error al obtener estudiantes por profesor:", error);
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};

// Obtener un profesor por su ID
const getProfesorById = async (req, res) => {
  try {
    const { id } = req.params;
    const profesor = await usuarioService.getProfesorById(id);
    res.status(200).json(profesor);
  } catch (error) {
    console.error("Error al obtener el profesor:", error);
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};

// Obtener un estudiante por su ID
const getEstudianteById = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await usuarioService.getEstudianteById(id);
    res.status(200).json(estudiante);
  } catch (error) {
    console.error("Error al obtener el estudiante:", error);
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};

//Actualizar admin
const updateAdmin = async (req, res) => {
  try {
    const { documento_identidad } = req.params;
    const { nombre, apellido, correo, id_institucion, contraseña } = req.body;

    const adminActualizado = await usuarioService.updateAdmin(
      documento_identidad,
      nombre,
      apellido,
      correo,
      id_institucion,
      contraseña
    );

    res.status(200).json({
      message: "Administrador actualizado con éxito",
      adminActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar el administrador:", error);
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};

// Actualizar datos de un profesor
const updateProfesor = async (req, res) => {
  try {
    const { documento_identidad } = req.params;
    const {
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      area_ensenanza,
    } = req.body;

    const usuarioActualizado = await usuarioService.updateProfesor(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      area_ensenanza
    );

    res
      .status(200)
      .json({ message: "Profesor actualizado con éxito", usuarioActualizado });
  } catch (error) {
    console.error("Error al actualizar el profesor:", error);
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};

// Actualizar datos de un estudiante
const updateEstudiante = async (req, res) => {
  try {
    const { documento_identidad } = req.params;
    const { nombre, apellido, correo, contraseña, id_institucion, id_curso } =
      req.body;

    const usuarioActualizado = await usuarioService.updateEstudiante(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      id_institucion,
      id_curso
    );

    res
      .status(200)
      .json({
        message: "Estudiante actualizado con éxito",
        usuarioActualizado,
      });
  } catch (error) {
    console.error("Error al actualizar el estudiante:", error);
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};

// Obtener docentes por institución
const getDocentesPorInstitucion = async (req, res) => {
  try {
    const { id_institucion } = req.params;
    const docentes = await usuarioService.getDocentesPorInstitucion(id_institucion);
    res.status(200).json(docentes);
  } catch (error) {
    console.error(`Error al obtener docentes en la institución "${req.params.id_institucion}":`, error);
    res.status(500).json({ error: `Error interno del servidor al obtener docentes en la institución "${req.params.id_institucion}": ${error.message}` });
  }
};


module.exports = {
  createAdmin,
  createProfesor,
  createEstudiante,
  getUsuarios,
  updateUsuario,
  deleteUsuario,
  activarUsuario,
  getAdmins,
  getDocentes,
  getEstudiantes,
  updateEstudiante,
  updateAdmin,
  updateProfesor,
  getEstudiantesPorInstitucion,
  getEstudiantesPorProfesor,
  getEstudianteById,
  getProfesorById,
  getDocentesPorInstitucion,
};