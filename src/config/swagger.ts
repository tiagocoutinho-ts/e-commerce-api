// src/config/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce Backend API",
      version: "1.0.0",
      description: "Documentação da API do e-commerce com arquitetura em camadas",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT no formato: Bearer <seu_token>",
        },
      },
    },
  },
  apis: [
    "./src/routers/**/*.ts",
    "./src/routers/**/*.js",
    "./dist/routers/**/*.js",
    "./routers/**/*.ts"
  ],
};

export const swaggerSpec = swaggerJSDoc(options);