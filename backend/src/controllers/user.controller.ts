// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import emailClient from '../config/email';

export class UserController {
    static async sendEmailChangeEmail(currentUserEmail: string, newEmail: string) {
        try {

            const msg = {
                to: currentUserEmail,
                from: process.env.EMAIL_FROM,
                subject: 'Your email address was changed',
                html: `
            <h2>Email Address Change</h2>
            <p>Thank you for using our services! This email is just to notify you that your email address was changed from ${currentUserEmail} to ${newEmail}.</p>
            <p>If you did not make this change, please contact our support for assistance.</p>
          `
            };

            return emailClient.send(msg);
        } catch (error) {
            console.error('sendEmailChangeEmail error:', error);
        }
    }

    static async sendDeleteAccountEmail(currentUserEmail: string) {
        try {

            const msg = {
                to: currentUserEmail,
                from: process.env.EMAIL_FROM,
                subject: 'Your email address was changed',
                html: `
                        <h2>Your account was deleted.</h2>
                        <p>This email is to notify you that your account has been successfully deleted.</p>
                        <p>If you did not request this, please contact our support for assistance.</p>
                    `
            };

            return emailClient.send(msg);
        } catch (error) {
            console.error('sendDeleteAccountEmail error:', error);
        }
    }

    static async getUser(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user?.userId },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    middle_name: user.middle_name,
                    last_name: user.last_name,
                    balance: user.balance,
                    is_verified: user.is_verified
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
            const { id } = req.params

            const user = await prisma.user.findUnique({
                where: { id: req.user?.userId },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (id !== user.id) {
                return res.status(403).json({ message: 'Cannot delete this user' })
            }

            await prisma.user.delete({
                where: {
                    id: id
                }
            });

            await UserController.sendDeleteAccountEmail(user.email)

            return res.json({ message: 'User deleted' });
        } catch (error) {
            console.error('Delete user error:', error);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { email, first_name, middle_name, last_name } = req.body;
            const userId = req.user?.userId;

            const currentUser = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!currentUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = await prisma.user.update({
                where: { id: userId },
                data: {
                    email,
                    first_name,
                    middle_name,
                    last_name
                }
            });

            if (email && email !== currentUser.email) {
                await UserController.sendEmailChangeEmail(currentUser.email, email);
            }

            return res.json({
                message: 'User updated',
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    middle_name: user.middle_name,
                    last_name: user.last_name,
                    is_verified: user.is_verified
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