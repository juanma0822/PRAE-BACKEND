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
  id_institucion
) => {
  try {
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
    return await usuarioModel.insertUsuario(
      documento_identidad,
      nombre,
      apellido,
      correo,
      hashedPassword,
      rol,
      id_institucion
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

const addProfesor = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  id_institucion,
  area_ensenanza
) => {
  try {
    const usuario = await addUsuario(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      "docente",
      id_institucion
    );
    await usuarioModel.insertProfesor(documento_identidad, area_ensenanza);
    return usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addEstudiante = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  id_institucion,
  id_curso
) => {
  try {
    const usuario = await addUsuario(
      documento_identidad,
      nombre,
      apellido,
      correo,
      contraseña,
      "estudiante",
      id_institucion
    );
    await usuarioModel.insertEstudiante(documento_identidad, id_curso);
    return usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUsuarios = async () => {
  return await usuarioModel.getUsuariosActivos();
};

const updateUsuario = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  rol,
  id_institucion
) => {
  const hashedPassword = contraseña ? await bcrypt.hash(contraseña, saltRounds) : null;
  return await usuarioModel.updateUsuario(
    documento_identidad,
    nombre,
    apellido,
    correo,
    hashedPassword,
    rol,
    id_institucion
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
  id_institucion,
  area_ensenanza
) => {
  const hashedPassword = contraseña ? await bcrypt.hash(contraseña, saltRounds) : null;
  return await usuarioModel.updateProfesor(
    documento_identidad,
    nombre,
    apellido,
    correo,
    hashedPassword,
    id_institucion,
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
  id_institucion,
  id_curso
) => {
  const hashedPassword = contraseña ? await bcrypt.hash(contraseña, saltRounds) : null;
  return await usuarioModel.updateEstudiante(
    documento_identidad,
    nombre,
    apellido,
    correo,
    hashedPassword,
    id_institucion,
    id_curso
  );
};

// Servicio para obtener los estudiantes de una institución
const getEstudiantesPorInstitucion = async (id_institucion) => {
  return await usuarioModel.getEstudiantesPorInstitucion(id_institucion);
};

// Servicio para obtener los estudiantes que un profesor les da clase
const getEstudiantesPorProfesor = async (documento_profe) => {
  return await usuarioModel.getEstudiantesPorProfesor(documento_profe);
};

// Servicio para obtener un profesor por su ID
const getProfesorById = async (documento_identidad) => {
  return await usuarioModel.getProfesorById(documento_identidad);
};

// Servicio para obtener un estudiante por su ID
const getEstudianteById = async (documento_identidad) => {
  return await usuarioModel.getEstudianteById(documento_identidad);
};

// Servicio para obtener los docentes de una institución
const getDocentesPorInstitucion = async (id_institucion) => {
  return await usuarioModel.getDocentesPorInstitucion(id_institucion);
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
  getProfesorById,
  getEstudianteById,
  getDocentesPorInstitucion,
};