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
            nombre: user.nombre,
            apellido: user.apellido,
            institucion: {
                id_institucion: user.id_institucion,
                nombre: user.nombre_institucion,
                telefono: user.telefono,
                instagram: user.instagram,
                facebook: user.facebook,
                logo: user.logo,
                color_principal: user.color_principal,
                color_secundario: user.color_secundario,
                fondo: user.fondo,
                color_pildora1: user.color_pildora1,
                color_pildora2: user.color_pildora2,
                color_pildora3: user.color_pildora3,
                estado: user.estado_institucion
            }
        };

        if (user.rol === 'estudiante') {
            payload.id_curso = user.id_curso;
            payload.curso = user.curso;
        }

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