const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Configuración de Swagger
const swaggerDefinition = {
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
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/Routes/*.js", 
    "./src/controllers/*.js",
    "./src/controllers/login.controller.js",
    "./src/index.js",
    "./src/Routes/testrouter/*.js"
  ], 
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
