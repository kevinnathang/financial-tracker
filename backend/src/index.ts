// src/index.ts
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import prisma from './lib/prisma';
import routes from './routes';

config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

app.use('/v1/api', routes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { });