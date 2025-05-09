import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';


const app = express();

// Middleware
app.use(helmet()); // Sécurité
app.use(cors()); // CORS
app.use(express.json()); // Parser JSON
app.use(morgan('dev')); // Logging
app.use('/api/rooms', roomRoutes);


// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Utilisateurs',
      version: '1.0.0',
      description: 'API de gestion des utilisateurs avec authentification JWT',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // fichiers contenant les annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Utilisateurs' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

export default app; 