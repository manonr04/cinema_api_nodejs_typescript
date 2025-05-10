import './db/models/room';
import './db/models/user';
import './db/models/seance';
import './db/models/movie';
import './db/models/transaction';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import { sequelize } from './db/sequelize';
import roomRoutes from './routes/roomRoutes';
import movieRoutes from './routes/movieRoutes';
import userRoutes from './routes/userRoutes';
import seancesRoutes from './routes/seanceRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes

//app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seances', seancesRoutes);
app.use('/api/transactions', transactionRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la DB OK");

    await sequelize.sync({ alter: true });
    console.log("Modèles synchronisés");
  } catch (e) {
    console.error("Erreur DB:", e);
  }
})();