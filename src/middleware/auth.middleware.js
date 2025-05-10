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
            rol: decoded.rol,
            id_institucion: decoded.institucion?.id_institucion, // Agregar id_institucion desde el token
            demo: decoded.demo || false, // Agregar el estado demo desde el token
        };

        // Verificar si el rol es uno de los permitidos
        const allowedRoles = ['admin', 'docente', 'estudiante'];

        if (!allowedRoles.includes(req.user.rol) && req.method !== 'GET') {
            return res.status(403).json({ error: 'Acceso denegado, rol no autorizado' });
        }

        // Bloquear rutas que no sean GET si el usuario está en modo demo
        if (req.user.demo && req.method !== 'GET') {
            return res.status(403).json({ error: 'Acceso restringido en modo demo' });
        }
        
        next(); // Pasar al siguiente middleware/controlador
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;
