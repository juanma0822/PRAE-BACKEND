const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
    },
    servers: [
      {
        url: "https://prae-backend.vercel.app",
        description: "Servidor en Vercel",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        JWT: {
          name: 'User Authorization',
          description: 'Value: Bearer {token}',
          type: 'apiKey',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    "./src/Routes/*.js", 
    "./src/controllers/*.js",
    "./src/controllers/login.controller.js",
    "./src/index.js",
    "./src/Routes/testrouter/*.js"
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
};

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocs, options),
};