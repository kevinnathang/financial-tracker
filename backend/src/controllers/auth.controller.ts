// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import crypto from 'crypto'
import { compare, genSalt, hash } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { tokenBlacklist } from '../middleware/auth.middleware';
import emailClient from '../config/email';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isValidPassword = await compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

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
                    full_name: user.full_name,
                    balance: user.balance
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Error during login' });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];

            tokenBlacklist.add(token);

            return res.json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ message: 'Error during logout' });
        }
    }

    static async requestResetPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(401).json({ message: 'User not found' })
            }

            const token = crypto.randomBytes(20).toString('hex');

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken: token,
                    resetPasswordExpires: new Date(Date.now() + 3600000)
                }
            });

            const resetUrl = `localhost:3001/reset-password/${token}`;

            const msg = {
                to: email,
                from: process.env.EMAIL_FROM,
                subject: 'Password Reset Request',
                html: `
                  <h2>Reset Your Password</h2>
                  <p>You requested to reset your password.</p>
                  <p>Click <a href="${resetUrl}">here</a> to reset your password or copy and paste this link in your browser:</p>
                  <p>${resetUrl}</p>
                  <p>This link will expire in 1 hour.</p>
                  <p>If you did not request this, please ignore this email.</p>
                `
            };

            await emailClient.send(msg)

            return res.status(200).json({ message: 'Password reset email sent' })
        } catch (error) {
            console.error('Password reset error:', error);
            return res.status(500).json({ message: 'Error sending password reset email' });
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const user = await prisma.user.findFirst({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: {
                        gt: new Date()
                    }
                }
            });

            if (!user) {
                return res.status(400).json({ message: 'Expired or invalid token' })
            }

            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt)

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password_hash: hashedPassword,
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                }
            });

            const msg = {
                to: user.email,
                from: process.env.EMAIL_FROM,
                subject: 'Password Reset Successful',
                html: `
                  <h2>Password Reset Successful</h2>
                  <p>Your password has been changed successfully.</p>
                  <p>If you did not make this change, please contact support immediately.</p>
                `
            };

            await emailClient.send(msg);
            return res.status(200).json({ message: 'Password has been reset successfully' });
        } catch (error) {
            console.error('Password reset error:', error);
            return res.status(500).json({ message: 'Error resetting password' });
        }
    };
}