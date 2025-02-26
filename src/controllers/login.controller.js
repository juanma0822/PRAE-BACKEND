const { config } = require('dotenv');
config();
const {verifyEmail}= require("../services/login.services")
const jwt = require("jsonwebtoken");

const VerifyLogin = async(req, res)=>{
    try {
        const { email, password } = req.body;
        console.log(email, password);
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
            institucion: user.institucion
        };

        if (user.rol === 'estudiante') {
            payload.id_curso = user.id_curso;
            payload.curso = user.curso;
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log(token);
        res.status(200).json({ message: "Login exitoso", token });

    } catch (e) {
        console.error(e);
        res.status(400).json({ error: e.message || "Error en la autenticación" });
    }
};

module.exports = {
VerifyLogin
};