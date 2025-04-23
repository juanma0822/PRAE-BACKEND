const { sendEmail, generateEmailTemplate } = require('../services/emailService');
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
        institucion: data.institucion
    };

    if (data.rol === 'estudiante') {
        payload.id_curso = data.id_curso;
        payload.curso = data.curso;
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
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

        // Obtener los datos de la institución del usuario
        const institucion = await institucionService.getInstitucionById(isCorrect.id_institucion);
        let { logo, nombre: nombreInstitucion, telefono, instagram, facebook, direccion } = institucion;

        // Usar el logo predeterminado de PRAE si no se proporciona uno
        if (!logo) {
            logo = "https://firebasestorage.googleapis.com/v0/b/praeweb-a1526.firebasestorage.app/o/logos%2FLOGO_SOMBRERO.svg?alt=media&token=d2e2d361-8a9f-45e0-857d-2e7408c9422d";
        }

        // Crear contenido principal del correo
        const mainContent = `
            <div style="text-align: center; padding: 20px;">
                <img src="${logo}" alt="Logo de la Institución" style="max-width: 200px; margin-bottom: 20px;" />
                <h1 style="color: #333;">¡Hola, ${isCorrect.nombre}!</h1>
                <p>Has solicitado un cambio de contraseña. Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #157AFE; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Restablecer mi contraseña</a>
                <p style="margin-top: 20px;">Si no solicitaste este cambio, por favor ignora este correo.</p>
            </div>
        `;

        // Crear contenido del footer
        const footerContent = `
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 14px; color: #666;">
                <p style="font-size: 18px; font-weight: bold;"><strong>${nombreInstitucion}</strong></p>
                <p>Teléfono: ${telefono || 'No disponible'}</p>
                <p>Dirección: ${direccion || 'No disponible'}</p>
                <p>
                    <a href="${instagram || '#'}" style="color: #157AFE; text-decoration: none;">Instagram</a> |
                    <a href="${facebook || '#'}" style="color: #157AFE; text-decoration: none;">Facebook</a>
                </p>
            </div>
        `;

        // Generar plantilla completa de correo
        const emailContent = generateEmailTemplate(mainContent, footerContent);

        // Enviar el correo usando el servicio de envío de correos
        await sendEmail(email, 'Recuperación de Contraseña', emailContent);

        return { message: 'Correo de recuperación enviado' };
    } catch (error) {
        throw new Error('Error al enviar el correo: ' + error.message);
    }
};

// Función para verificar el token de recuperación
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

module.exports = { sendRecoveryEmail, verifyToken };
