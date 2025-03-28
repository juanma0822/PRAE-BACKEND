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
          name: "User Authorization",
          description: "Value: Bearer {token}",
          type: "apiKey",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
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
