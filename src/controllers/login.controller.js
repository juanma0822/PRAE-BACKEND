const { config } = require('dotenv');
config();
const { verifyEmail } = require("../services/login.services");
const jwt = require("jsonwebtoken");

const VerifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son requeridos" });
        }

        const user = await verifyEmail({ email, password });

        const payload = {
            email: user.correo,
            id: user.documento_identidad,
            rol: user.rol,
            nombre: user.nombre, // Asegúrate de que este es el nombre del usuario
            apellido: user.apellido,
            institucion: {
                id_institucion: user.id_institucion,
                nombre: user.nombre_institucion, // Asegúrate de que este es el nombre de la institución
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
                estado: user.estado_institucion
            }
        };

        if (user.rol === 'estudiante') {
            payload.id_curso = user.id_curso;
            payload.curso = user.curso;
        }

        console.log("Payload:", payload); // Agrega un console.log para verificar el payload

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });
        res.status(200).json({ message: "Login exitoso", token });

    } catch (e) {
        console.error(e);
        res.status(400).json({ error: e.message || "Error en la autenticación" });
    }
};

module.exports = {
    VerifyLogin
};