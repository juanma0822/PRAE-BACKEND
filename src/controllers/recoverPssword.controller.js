const { sendRecoveryEmail, verifyToken } = require('../services/recoverPassword.services');


const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'El email es obligatorio' });
        }

        const result = await sendRecoveryEmail(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = verifyToken(token);
        
        res.status(200).json({ message: 'Token válido', email: decoded.email, id:decoded.id , rol:decoded.rol });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { recoverPassword, validateResetToken };
