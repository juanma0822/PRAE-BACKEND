const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API-PRAE Documentation",
      version: "1.0.0",
      description: "Documentación de la API PRAE con Swagger",
    },
    servers: [
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

// URL del CDN CSS
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const options = {
  customCssUrl: CSS_URL,
  customSiteTitle: "PRAE API Documentation",
  swaggerOptions: {
    url: "https://prae-backend.vercel.app/swagger.json", // Asegura que puedas servir este JSON
  },
};

console.log("Swagger Docs:", JSON.stringify(swaggerDocs, null, 2));


module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocs, options),
  swaggerDocs,
};