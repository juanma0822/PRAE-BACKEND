const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const router = express.Router();

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API-PRAE Documentation",
      version: "1.0.1",
      description: "Documentación de la API PRAE con Swagger",
    },
    servers: [
      {
        url: "https://mi-backend-prae-55793889802.us-central1.run.app",
        description: "Servidor en Produccion",
      },
      {
        url: "https://prae-backend.up.railway.app",
        description: "Servidor en Railway",
      },
      {
        url: "https://prae-backend.vercel.app",
        description: "Servidor en Vercel",
      },
      {
        url: "http://localhost:5000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        JWT: {
          name: "User Authorization",
          description: "Value: Bearer {token}",
          type: "apiKey",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Schema para Institución
        Institucion: {
          type: "object",
          properties: {
            id_institucion: { type: "integer", description: "ID de la institución" },
            nombre: { type: "string", description: "Nombre de la institución" },
            telefono: { type: "string", description: "Teléfono de la institución" },
            instagram: { type: "string", description: "URL del Instagram de la institución" },
            facebook: { type: "string", description: "URL del Facebook de la institución" },
            direccion: { type: "string", description: "Dirección de la institución" },
            logo: { type: "string", format: "binary", description: "Logo de la institución" },
            color_principal: { type: "string", description: "Color principal de la institución" },
            color_secundario: { type: "string", description: "Color secundario de la institución" },
            fondo: { type: "string", description: "Color de fondo de la institución" },
            color_pildora1: { type: "string", description: "Color de la primera píldora" },
            color_pildora2: { type: "string", description: "Color de la segunda píldora" },
            color_pildora3: { type: "string", description: "Color de la tercera píldora" },
            estado: { type: "boolean", description: "Estado de la institución (activa o inactiva)" },
          },
        },

        // Schema para Usuario
        Usuario: {
          type: "object",
          properties: {
            documento_identidad: { type: "string", description: "Documento de identidad del usuario" },
            nombre: { type: "string", description: "Nombre del usuario" },
            apellido: { type: "string", description: "Apellido del usuario" },
            correo: { type: "string", description: "Correo electrónico del usuario" },
            contraseña: { type: "string", description: "Contraseña del usuario" },
            rol: { type: "string", description: "Rol del usuario (admin, profesor, estudiante)" },
            id_institucion: { type: "integer", description: "ID de la institución asociada" },
            activo: { type: "boolean", description: "Estado del usuario (activo o inactivo)" },
          },
        },

        // Schema para Curso
        Curso: {
          type: "object",
          properties: {
            id_curso: { type: "integer", description: "ID del curso" },
            nombre: { type: "string", description: "Nombre del curso" },
            id_institucion: { type: "integer", description: "ID de la institución asociada" },
            activo: { type: "boolean", description: "Estado del curso (activo o inactivo)" },
          },
        },

        // Schema para Materia
        Materia: {
          type: "object",
          properties: {
            id_materia: { type: "integer", description: "ID de la materia" },
            nombre: { type: "string", description: "Nombre de la materia" },
            id_institucion: { type: "integer", description: "ID de la institución asociada" },
            activo: { type: "boolean", description: "Estado de la materia (activa o inactiva)" },
          },
        },

        // Schema para Actividad
        Actividad: {
          type: "object",
          properties: {
            id_actividad: { type: "integer", description: "ID de la actividad" },
            nombre: { type: "string", description: "Nombre de la actividad" },
            peso: { type: "integer", description: "Peso de la actividad" },
            id_materia: { type: "integer", description: "ID de la materia asociada" },
            id_docente: { type: "string", description: "Documento de identidad del docente" },
            id_curso: { type: "integer", description: "ID del curso asociado" },
            id_periodo: { type: "integer", description: "ID del periodo académico asociado" },
            activo: { type: "boolean", description: "Estado de la actividad (activa o inactiva)" },
          },
        },

        // Schema para Calificación
        Calificacion: {
          type: "object",
          properties: {
            id_calificacion: { type: "integer", description: "ID de la calificación" },
            id_actividad: { type: "integer", description: "ID de la actividad asociada" },
            id_estudiante: { type: "string", description: "Documento de identidad del estudiante" },
            nota: { type: "number", format: "float", description: "Nota de la calificación" },
            activo: { type: "boolean", description: "Estado de la calificación (activa o inactiva)" },
          },
        },

        // Schema para Comentario
        Comentario: {
          type: "object",
          properties: {
            id_comentario: { type: "integer", description: "ID del comentario" },
            comentario: { type: "string", description: "Texto del comentario" },
            documento_profe: { type: "string", description: "Documento de identidad del profesor" },
            documento_estudiante: { type: "string", description: "Documento de identidad del estudiante" },
            fecha: { type: "string", format: "date-time", description: "Fecha del comentario" },
          },
        },
      },
    },
  },
  apis: ["./src/Routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Ruta para exponer el JSON de Swagger
router.get("/swagger.json", (req, res) => {
  res.json(swaggerDocs);
});

// URL del CDN CSS
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

// Configurar Swagger UI para que consuma el JSON
const options = {
  swaggerOptions: {
    url: "/api-docs/swagger.json", // Swagger cargará el JSON desde aquí
  },
  customCss: `
    .swagger-ui .opblock .opblock-summary-path-description-wrapper {
      align-items: center; 
      display: flex; 
      flex-wrap: wrap; 
      gap: 0 10px; 
      padding: 0 10px; 
      width: 100%;
    }
  `,
  customCssUrl: CSS_URL,
  customSiteTitle: "PRAE API Documentation",
  customfavIcon: "https://petstore.swagger.io/favicon-32x32.png",
};

// Ruta para la interfaz de Swagger
router.use("/", swaggerUi.serve, swaggerUi.setup(null, options));

module.exports = router;
