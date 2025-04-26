const { sendRecoveryEmail, verifyToken } = require('../services/recoverPassword.services');

// Controlador para iniciar el proceso de recuperación de contraseña
const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Email requerido",
                detalle: "El campo email es obligatorio para iniciar el proceso de recuperación",
            });
        }

        // Llamamos al servicio para enviar el correo de recuperación
        const result = await sendRecoveryEmail(email);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error en recoverPassword:", error.message);
        res.status(500).json({
            error: "Error al iniciar el proceso de recuperación",
            detalle: error.message,
        });
    }
};

// Controlador para validar el token de recuperación
const validateToken = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                error: "Token requerido",
                detalle: "El token es obligatorio para validar el reinicio de contraseña",
            });
        }

        // Verificar y decodificar el token
        const decoded = verifyToken(token);

        // Si todo es correcto, devolvemos el correo y la información del usuario
        res.status(200).json({
            message: "Token válido",
            email: decoded.email,
            id: decoded.id,
            rol: decoded.rol,
        });
    } catch (error) {
        console.error("Error en validateToken:", error.message);
        res.status(400).json({
            error: "Token inválido o expirado",
            detalle: error.message,
        });
    }
};

const validateResetToken = async (req, res) => {
    try {
        // Los datos del token ya están en req.user gracias al middleware
        const { email, id, rol } = req.user;

        res.status(200).json({
            message: "Token válido",
            email,
            id,
            rol,
        });
    } catch (error) {
        console.error("Error al validar el token de recuperación:", error.message);
        res.status(500).json({
            error: "Error al validar el token",
            detalle: error.message,
        });
    }
};

module.exports = { recoverPassword, validateToken,  validateResetToken };