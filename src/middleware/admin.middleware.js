// middlewares/admin.middleware.js
const adminMiddleware = (req, res, next) => {
    // Verificar si el rol del usuario es 'admin'
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: No tienes permisos de administrador' });
    }
    next(); // Si el usuario es admin, continuar con la solicitud
};

module.exports = adminMiddleware;
