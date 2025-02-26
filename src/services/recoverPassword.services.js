require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const models =require('../models/user.model')

const generateToken = (data) => {
    const payload = {
        email: data.correo,
        id: data.documento_identidad,
        rol: data.rol,
        nombre: data.nombre,
        apellido: data.apellido
    };

    if (data.rol === 'estudiante') {
        payload.id_curso = data.id_curso;
        payload.curso = data.curso;
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const sendRecoveryEmail = async (email) => {
    try {
        const isCorrect= models.ExistingUser(email)
        const token = generateToken(isCorrect);
        const resetLink = `http://localhost:5000/test/validate/${token}`;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: "escastr@gmail.com",
              pass: "qypu gnux wbis sdib",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
      

        const mailOptions = {
            from: '"PRAE" <escastr@gmail.com>',
            to: email,
            subject: 'Recuperación de Contraseña',
            text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);

        return { message: 'Correo de recuperación enviado', resetLink };
    } catch (error) {
        throw new Error('Error enviando el correo: ' + error.message);
    }
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

module.exports = { sendRecoveryEmail, verifyToken };
