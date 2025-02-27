// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { hash, compare } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const DEFAULT_EXPIRES_IN = '24h';
const userRepository = AppDataSource.getRepository(User);

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { email, password, full_name } = req.body;

            // Check if user already exists
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await hash(password, 10);

            // Create new user
            const user = new User();
            user.email = email;
            user.password_hash = hashedPassword;
            user.full_name = full_name;

            // Save user
            await userRepository.save(user);

            // Generate JWT
            const jwtSecret: Secret = process.env.JWT_SECRET || 'default-secret';
            const jwtOptions: SignOptions = { expiresIn: 24 * 60 * 60 };
            const token = jwt.sign(
                { userId: user.id },
                jwtSecret,
                jwtOptions
            );

            return res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Error creating user' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT
            const jwtSecret: Secret = process.env.JWT_SECRET || 'default-secret';
            const jwtOptions: SignOptions = { expiresIn: 24 * 60 * 60 };
            const token = jwt.sign(
                { userId: user.id },
                jwtSecret,
                jwtOptions
            );

            return res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Error during login' });
        }
    }
}