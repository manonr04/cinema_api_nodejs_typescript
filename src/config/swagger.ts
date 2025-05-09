import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sample TypeScript API',
      version: '1.0.0',
      description: 'Une API RESTful construite avec TypeScript et Express',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // fichiers contenant les annotations
};

export const swaggerSpec = swaggerJsdoc(options); 