const usuarioModel = require("../models/usuario.model");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

const addUsuario = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  rol,
  institucion
) => {
  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    // Enviar los datos al modelo para insertarlos en la BD
    const newUser = await usuarioModel.insertUsuario(
      documento_identidad,
      nombre,
      apellido,
      correo,
      hashedPassword,
      rol,
      institucion
    );
 
    return newUser;
  } catch (error) {
    console.error("Error al registrar usuario: ", error);
    throw new Error("Error al registrar usuario: " + error.detail);
  }
};

const addProfesor = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  institucion,
  area_ensenanza,
  id_materia
) => {
  const usuario = await addUsuario(
    documento_identidad,
    nombre,
    apellido,
    correo,
    contraseña,
    "docente",
    institucion
  );
  await usuarioModel.insertProfesor(
    documento_identidad,
    area_ensenanza,
    id_materia
  );
  return usuario;
};

const addEstudiante = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  institucion,
  id_curso
) => {
  const usuario = await addUsuario(
    documento_identidad,
    nombre,
    apellido,
    correo,
    contraseña,
    "estudiante",
    institucion
  );
  await usuarioModel.insertEstudiante(documento_identidad, id_curso);
  return usuario;
};

const getAllUsuarios = async () => {
  return await usuarioModel.getUsuariosActivos();
};

const updateUsuario = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  rol,
  institucion
) => {
  return await usuarioModel.updateUsuario(
    documento_identidad,
    nombre,
    apellido,
    correo,
    rol,
    institucion
  );
};

const deleteUsuario = async (documento_identidad) => {
  return await usuarioModel.desactivarUsuario(documento_identidad);
};

const activarUsuario = async (documento_identidad) => {
  try {
    const usuario = await usuarioModel.activarUsuario(documento_identidad);
    if (!usuario) {
      throw new Error("Usuario no encontrado o ya activo");
    }
    return usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUsuariosByRol = async (rol) => {
  try {
    const usuarios = await usuarioModel.getUsuariosByRol(rol);
    if (usuarios.length === 0) {
      throw new Error(`No se encontraron usuarios con el rol: ${rol}`);
    }
    return usuarios;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Servicio para actualizar un profesor
const updateProfesor = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  institucion,
  area_ensenanza
) => {
  const hashedPassword = contraseña ? await bcrypt.hash(contraseña, 10) : null;
  return await usuarioModel.updateProfesor(
    documento_identidad,
    nombre,
    apellido,
    correo,
    hashedPassword,
    institucion,
    area_ensenanza
  );
};

// Servicio para actualizar un estudiante
const updateEstudiante = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  institucion,
  id_curso
) => {
  const hashedPassword = contraseña ? await bcrypt.hash(contraseña, 10) : null;
  return await usuarioModel.updateEstudiante(
    documento_identidad,
    nombre,
    apellido,
    correo,
    hashedPassword,
    institucion,
    id_curso
  );
};

// Servicio para obtener los estudiantes de una institución
const getEstudiantesPorInstitucion = async (institucion) => {
  return await usuarioModel.getEstudiantesPorInstitucion(institucion);
};

// Servicio para obtener los estudiantes que un porfesor les da clase
const getEstudiantesPorProfesor = async (documento_profe) => {
  return await usuarioModel.getEstudiantesPorProfesor(documento_profe);
};

module.exports = {
  addUsuario,
  addProfesor,
  addEstudiante,
  getAllUsuarios,
  updateUsuario,
  deleteUsuario,
  activarUsuario,
  getUsuariosByRol,
  updateProfesor,
  updateEstudiante,
  getEstudiantesPorInstitucion,
  getEstudiantesPorProfesor,
};
