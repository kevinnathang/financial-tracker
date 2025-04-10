// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { hash } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const { email, password, full_name } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    full_name
                }
            });

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
                    full_name: user.full_name,
                    balance: 0
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Error creating user' });
        }
    }

    static async getUser(req: Request, res: Response) {
        console.log("getUser controller called")
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user?.userId },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log(user)

            return res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    balance: user.balance
                }
            });
        } catch (error) {
            console.error('Get user error:', error);
            return res.status(500).json({ message: 'Error getting user' });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            return res.json({ users });
        } catch (error) {
            console.error('Get all users error:', error);
            return res.status(500).json({ message: 'Error getting users' });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user?.userId },
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await prisma.user.delete({
                where: {
                    id: req.user?.userId
                }
            });

            return res.json({ message: 'User deleted' });
        } catch (error) {
            console.error('Delete user error:', error);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { email, full_name } = req.body;
            const userId = req.user?.userId;

            const user = await prisma.user.update({
                where: { id: userId },
                data: {
                    email,
                    full_name
                }
            });

            return res.json({
                message: 'User updated',
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name
                }
            });
        } catch (error) {
            console.error('Update user error:', error);
            if ((error as any).code === 'P2025') {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(500).json({ message: 'Error updating user' });
        }
    }
}