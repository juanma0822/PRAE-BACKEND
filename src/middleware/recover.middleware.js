const jwt = require('jsonwebtoken');

const verifyRecoveryToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization'); // Obtener el token del header

        if (!authHeader) {
            return res.status(401).json({
                error: "Token requerido",
                detalle: "No se proporcionó un token de recuperación",
            });
        }

        // Verificar si el token empieza con "Bearer " y extraer solo el token real
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar que el token sea del tipo 'recover'
        if (decoded.tipo !== 'recover') {
            return res.status(403).json({
                error: "Token inválido",
                detalle: "El token no es válido para recuperación de contraseña",
            });
        }

        // Adjuntar los datos decodificados al request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error al verificar el token de recuperación:", error.message);
        res.status(401).json({
            error: "Token inválido o expirado",
            detalle: error.message,
        });
    }
};

module.exports = verifyRecoveryToken;