const transporter = require('../config/nodemailer');


const generateRecoverPasswordTemplate = ({
  nombreUsuario,
  correoUsuario,
  resetLink,
  nombreInstitucion,
  telefonoInstitucion,
  direccionInstitucion,
  instagram,
  facebook,
  logoUrl,
}) => {
  return `
  <!doctype html>
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <meta content="telephone=no" name="format-detection" />
    <title>Recuperación de contraseña - PRAE</title>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        background-color: #0c1b46; /* Fondo azul oscuro */
        font-family: Arial, Helvetica, "sans-serif";
        color: #333333;
        width: 100%;
        height: 100%;
      }
      #preHeader {
        display: none !important;
        max-height: 0 !important;
        overflow: hidden !important;
        color: transparent !important;
      }
      .main-container {
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #2c6bed, #0c1446);
        padding: 20px 0;
        box-sizing: border-box;
      }
      .logo-bar {
        max-width: 640px;
        margin: 0 auto 20px auto;
        padding: 0 24px;
        display: flex;
        align-items: center;
      }
      .logo-bar img {
        height: 100px;
        width: auto;
      }
      .template-container {
        max-width: 640px;
        margin: 0 auto;
        background-color: #FAFAFA;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 0 15px rgba(0,0,0,0.3);
      }
      h1 {
        font-size: 32px;
        line-height: 40px;
        margin: 0 0 24px 0;
        font-weight: bold;
        text-align: center;
      }
      p {
        margin: 0 0 24px 0;
        font-size: 16px;
        line-height: 24px;
      }
      a.button {
        display: inline-block;
        background-color: #157AFE;
        color: white !important;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        margin: 0 auto 24px auto;
      }
      .footer {
        background-color: #f5f5f5;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666666;
        border-radius: 0 0 16px 16px;
      }
      .footer strong {
        font-size: 18px;
        display: block;
        margin-bottom: 8px;
      }
      .social-icons img {
        width: 32px;
        height: 32px;
        margin: 0 8px;
        vertical-align: middle;
      }
      .logo-prae {
        display: block;
        margin: 24px auto 12px auto;
        max-width: 200px;
      }
      .text-center {
        text-align: center;
      }
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #101523;
          color: #FAFAFA;
        }
        .main-container {
          background-color: #101523;
        }
        .template-container {
          background-color: #162447; /* Azul oscuro sobrio */
          color: #FAFAFA;
        }
        a.button {
          background-color: #157AFE; /* Azul principal */
        }
        .footer {
          background-color: #1b263b; /* Azul más oscuro */
          color: #FFFFFF;
        }
        .footer strong {
          color: #157AFE; /* Azul principal */
        }
        .bottom-text {
          color: #FFFFFF;
        }
      }
      /* Responsive styles */
      @media screen and (max-width: 640px) {
        .template-container {
          max-width: 90% !important; /* Usa casi todo el ancho del móvil */
          padding: 16px !important;
        }
        .logo-bar {
          padding: 0 12px !important;
          justify-content: center; /* Centra el logo en móviles */
        }
        .logo-bar img {
          height: 80px !important; /* Reduce un poco el tamaño del logo */
        }
        h1 {
          font-size: 24px !important;
          line-height: 32px !important;
          text-align: center !important; /* Centra el título en móvil */
        }
        p, .footer {
          font-size: 14px !important;
          line-height: 20px !important;
        }
        a.button {
          width: 100% !important; /* Botón ancho completo en móvil */
          padding: 14px 0 !important;
        }
      }
    </style>
  </head>
  <body>
    <div id="preHeader">Recuperación de contraseña para tu cuenta PRAE.</div>
    <div class="main-container">
      <div class="logo-bar">
        <img src="${logoUrl}" alt="Logo PRAE" />
      </div>
      <!-- Contenedor para el título, fuera de la tabla -->
      <div style="max-width: 640px; margin: 0 auto 20px auto; padding: 0 24px;">
        <h1 style="
          font-size: 32px; 
          line-height: 40px; 
          margin: 0; 
          color:rgb(255, 255, 255); 
          font-weight: bold; 
          text-align: left;">
          Recuperación de contraseña
        </h1>
      </div>
      <table class="template-container" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          <td>
            <p>Hola <strong>${nombreUsuario}</strong>,</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>PRAE</strong>.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña. Este enlace es válido por <strong>10 minutos</strong>:</p>
            <p class="text-center">
              <a href="${resetLink}" class="button" target="_blank" rel="noopener">Restablecer mi contraseña</a>
            </p>
            <p>Si no solicitaste este cambio, puedes ignorar este correo sin ningún problema.</p>
            
            <p style="font-weight: bold; line-height: 1.2; margin-bottom: 24px;">
              Éxitos en tus clases!<br/>
              El equipo de PRAE
            </p>
            <hr style="border: none; border-top: 1px solid #DEDEDE; margin: 24px 0;" />
            <p>Link not working? If this email is in your Spam/Junk folder please move it to your inbox, then click the confirmation link.</p>
            <p>If you received this email and do not have a PRAE account, please ignore and delete this email.</p>
            <p>NOTE: this is an automated email. Please do not reply to this message. For help, please visit support.prae.com.</p>
          </td>
        </tr>
      </table>
      <!-- Footer fuera de la tabla principal -->
      <div style="
        max-width: 640px;
        margin: 40px auto 20px auto;
        padding: 20px 24px;
        color: white;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
      ">

        <!-- Iconos sociales -->
      <div style="margin-bottom: 16px;">
        <a href="#" >
          <img src="https://img.icons8.com/?size=100&id=118467&format=png&color=FFFFFF" alt="Facebook" width="24" style="filter: invert(1) grayscale(1) brightness(1);" />
        </a>
        <a href="#" >
          <img src="https://img.icons8.com/?size=100&id=32309&format=png&color=FFFFFF" alt="Instagram" width="24" style="filter: invert(1) grayscale(1) brightness(1);" />
        </a>
        <a href="#" >
          <img src="https://img.icons8.com/?size=100&id=118638&format=png&color=FFFFFF" alt="TikTok" width="24" style="filter: invert(1) grayscale(1) brightness(1);" />
        </a>
        <a href="#" >
          <img src="https://img.icons8.com/?size=100&id=37326&format=png&color=FFFFFF" alt="YouTube" width="24" style="filter: invert(1) grayscale(1) brightness(1);" />
        </a>
      </div>

        <!-- Links tipo texto -->
        <div style="margin-bottom: 20px; font-weight: bold;">
          Shop Now | Blog | Support | Privacy Policy
        </div>

        <!-- Info de la empresa -->
        <div>
          This email was sent to <strong>${correoUsuario}</strong> by PRAE, Calle Demo 123, Ciudad Demo.<br/>
          Please do not reply to this message.
        </div>
        <div style="margin-top: 12px; font-size: 12px;">
          © 2025 PRAE. All rights reserved. PRAE and the PRAE logo are trademarks of PRAE. All other trademarks and logos herein are the property of their respective owners.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Función para generar la plantilla genérica del correo
const generateEmailTemplate = (mainContent, footerContent, includeButton = true) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <!-- Barra azul superior -->
      <div style="background-color: #157AFE; height: 30px; width: 100%;"></div>

      <!-- Contenido principal -->
      ${mainContent}

      <!-- Botón para ingresar a la aplicación -->
      ${
        includeButton
          ? `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.CLIENT_URL}" 
               style="display: inline-block; padding: 10px 20px; background-color: #157AFE; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Ingresa aquí
            </a>
          </div>
          `
          : ''
      }

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

module.exports = { sendEmail, generateEmailTemplate, generateRecoverPasswordTemplate };