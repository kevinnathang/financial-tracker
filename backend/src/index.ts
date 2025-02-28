// src/index.ts
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import prisma from './lib/prisma';
import routes from './routes';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/api', routes);

// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Handle application shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});