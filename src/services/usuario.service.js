const usuarioModel = require("../models/usuario.model");
const bcrypt = require("bcrypt");

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
    throw new Error("Error al registrar usuario");
  }
};

const addProfesor = async (
  documento_identidad,
  nombre,
  apellido,
  correo,
  contraseña,
  institucion,
  area_ensenanza
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
  await usuarioModel.insertProfesor(documento_identidad, area_ensenanza);
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

module.exports = {
  addUsuario,
  addProfesor,
  addEstudiante,
  getAllUsuarios,
  updateUsuario,
  deleteUsuario,
  activarUsuario,
  getUsuariosByRol,
};
