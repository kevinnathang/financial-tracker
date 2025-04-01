// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: { userId: string };
        }
    }
}

export const tokenBlacklist = new Set<string>();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decoded = verify(token, process.env.JWT_SECRET || 'default-secret') as { userId: string };

        req.user = decoded;
        (req as any).token = token

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};