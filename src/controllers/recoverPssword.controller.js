const { sendRecoveryEmail, verifyToken } = require('../services/recoverPassword.services');

// Controlador para iniciar el proceso de recuperación de contraseña
const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El email es obligatorio' });
        }

        // Llamamos al servicio para enviar el correo de recuperación
        const result = await sendRecoveryEmail(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para validar el token de recuperación
const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = verifyToken(token);  // Verificar y decodificar el token
        
        // Si todo es correcto, devolvemos el correo y la información del usuario
        res.status(200).json({ message: 'Token válido', email: decoded.email, id: decoded.id, rol: decoded.rol });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { recoverPassword, validateResetToken };
