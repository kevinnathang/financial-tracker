// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

// Extend Express Request type to include user
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
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify token
        const decoded = verify(token, process.env.JWT_SECRET || 'default-secret') as { userId: string };

        // Add user info to request
        req.user = decoded;
        (req as any).token = token

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};