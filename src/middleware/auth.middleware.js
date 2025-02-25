const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Obtener token del header

    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
    }
    // Verificar si el token empieza con "Bearer " y extraer solo el token real
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar token
        req.user = {
            email: decoded.email,
            id: decoded.id,
            rol: decoded.rol
        };
        next(); // Pasar al siguiente middleware/controlador
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;
