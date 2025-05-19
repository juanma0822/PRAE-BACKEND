const { sendEmail, generateRecoverPasswordTemplate } = require('../services/emailService');
const models = require('../models/usuario.model'); // Asegúrate de que la ruta sea correcta
const institucionService = require('../services/institucion.service');
const jwt = require('jsonwebtoken');

// Función para generar el token de recuperación
const generateToken = (data) => {
    const payload = {
        email: data.correo,
        id: data.documento_identidad,
        rol: data.rol,
        nombre: data.nombre,
        apellido: data.apellido,
        institucion: data.institucion,
        tipo: 'recover',
    };

    if (data.rol === 'estudiante') {
        payload.id_curso = data.id_curso;
        payload.curso = data.curso;
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
};

// Función para enviar correo de recuperación de contraseña
const sendRecoveryEmail = async (email) => {
    try {
        // Verificar que el usuario exista
        const isCorrect = await models.ExistingUser(email);

        if (!isCorrect) {
            throw new Error('El usuario con ese correo no existe.');
        }

        // Generar el token de recuperación
        const token = generateToken(isCorrect);

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`; // Ajusta el URL para el frontend

        console.log(token);

        // Obtener los datos de la institución del usuario
        const institucion = await institucionService.getInstitucionById(isCorrect.id_institucion);
        let {nombre: nombreInstitucion, telefono, instagram, facebook, direccion } = institucion;

        // Usar el logo predeterminado de PRAE en BLANCO
        logo = "https://firebasestorage.googleapis.com/v0/b/praeweb-a1526.firebasestorage.app/o/logos%2FLOGO_White.png?alt=media&token=3da2e251-2587-4c03-8496-b4b667ebd587";


        // Crear contenido principal del correo
        // Aquí generas el HTML usando el template específico para recuperación
        const emailContent = generateRecoverPasswordTemplate({
            nombreUsuario: isCorrect.nombre,
            correoUsuario: email,
            resetLink,
            nombreInstitucion: nombreInstitucion,
            telefonoInstitucion: telefono,
            direccionInstitucion: direccion,
            instagram,
            facebook,
            logoUrl: logo,
        });

        // Enviar el correo usando el servicio de envío de correos
        await sendEmail(email, 'Recuperación de Contraseña', emailContent);

        return { message: 'Correo de recuperación enviado' };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Función para verificar el token de recuperación
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded;
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

module.exports = { sendRecoveryEmail, verifyToken };
