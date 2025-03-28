const transporter = require('../config/nodemailer');

// Función para generar la plantilla genérica del correo
const generateEmailTemplate = (mainContent, footerContent) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <!-- Barra azul superior -->
      <div style="background-color: #157AFE; height: 30px; width: 100%;"></div>

      <!-- Contenido principal -->
      ${mainContent}

      <!-- Footer específico -->
      ${footerContent}

      <!-- Barra azul inferior -->
      <div style="background-color: #157AFE; height: 30px; width: 100%;"></div>

      <!-- Logo de PRAE y texto adicional -->
      <div style="text-align: center; padding: 20px;">
        <img src="https://firebasestorage.googleapis.com/v0/b/praeweb-a1526.firebasestorage.app/o/logos%2FlogoPRAE.png?alt=media&token=4c1c3239-5950-47e6-94cb-4c53d39822ad" 
             alt="Logo PRAE" 
             style="max-width: 200px; margin-bottom: 10px;" />
        <p style="font-size: 14px; color: #666;">Plataforma de Registro Académico Estudiantil</p>
      </div>
    </div>
  `;
};

// Función para enviar correos
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `PRAE - Plataforma de Registro Académico Estudiantil <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      headers: {
        'X-Mailer': 'Nodemailer', // Identifica el software de envío
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ', info.response);
    return info;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};

module.exports = { sendEmail, generateEmailTemplate };