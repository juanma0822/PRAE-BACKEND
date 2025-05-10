const { config } = require('dotenv');
config();
const { verifyEmail } = require("../services/login.services");
const jwt = require("jsonwebtoken");

const VerifyLogin = async (req, res) => {
    try {
        const { email, password, demo, rol } = req.body; // Agregar el parámetro demo y rol

        // Validar que los campos requeridos estén presentes
        if (!demo && (!email || !password)) {
            return res.status(400).json({
                error: "Email y contraseña son requeridos",
                detalle: "Por favor, proporciona ambos campos para iniciar sesión",
            });
        }

        let user;

        // Si es modo demo, obtener el usuario ficticio según el rol
        if (demo) {
            if (!rol) {
                return res.status(400).json({
                    error: "El rol es requerido en modo demo",
                    detalle: "Por favor, proporciona el rol (admin, profesor, estudiante)",
                });
            }

            const demoUsers = {
                admin: { email: "juan.demo@prae.com", password: "demo" },
                docente: { email: "carlos.demo@prae.com", password: "demo" },
                estudiante: { email: "ana.demo@prae.com", password: "demo" },
            };

            const demoUser = demoUsers[rol.toLowerCase()];
            if (!demoUser) {
                return res.status(400).json({
                    error: "Rol inválido",
                    detalle: "El rol debe ser uno de los siguientes: admin, profesor, estudiante",
                });
            }

            user = await verifyEmail(demoUser);
        } else {
            // Llamar al servicio para verificar el email y la contraseña
            user = await verifyEmail({ email, password });
        }

        // Crear el payload para el token
        const payload = {
            email: user.correo,
            id: user.documento_identidad,
            rol: user.rol,
            nombre: user.nombre,
            apellido: user.apellido,
            demo: !!demo, // Indicar si es modo demo
            institucion: {
                id_institucion: user.id_institucion,
                nombre: user.nombre_institucion,
                telefono: user.telefono_institucion,
                instagram: user.instagram_institucion,
                facebook: user.facebook_institucion,
                logo: user.logo_institucion,
                color_principal: user.color_principal_institucion,
                color_secundario: user.color_secundario_institucion,
                fondo: user.fondo_institucion,
                color_pildora1: user.color_pildora1_institucion,
                color_pildora2: user.color_pildora2_institucion,
                color_pildora3: user.color_pildora3_institucion,
                estado: user.estado_institucion,
                direccion: user.direccion_institucion,
            },
        };

        // Agregar información adicional si el usuario es estudiante
        if (user.rol === 'estudiante') {
            payload.id_curso = user.id_curso;
            payload.curso = user.curso;
        }

        // Generar el token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });

        // Responder con éxito
        res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
        console.error("Error en VerifyLogin:", error.message);

        // Manejar errores específicos
        if (error.message === "Email y contraseña son requeridos" || 
            error.message === "Formato inválido de email o contraseña" || 
            error.message === "Email no es válido") {
            return res.status(400).json({
                error: "Error en los datos proporcionados",
                detalle: error.message,
            });
        }

        if (error.message === "El email no está registrado" || 
            error.message === "Contraseña incorrecta") {
            return res.status(401).json({
                error: "Credenciales inválidas",
                detalle: error.message,
            });
        }

        if (error.message === "Usuario desactivado, comunícate con tu institución para ingresar") {
            return res.status(403).json({
                error: "Usuario desactivado",
                detalle: error.message,
            });
        }

        // Manejar errores generales
        res.status(500).json({
            error: "Error en el servidor",
            detalle: error.message,
        });
    }
};

module.exports = {
    VerifyLogin,
};