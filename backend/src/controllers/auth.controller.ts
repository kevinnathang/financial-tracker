// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import crypto from 'crypto'
import { compare, genSalt, hash } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { tokenBlacklist } from '../middleware/auth.middleware';
import emailClient from '../config/email';

export class AuthController {
    static async initiateUserRegistration(req: Request, res: Response) {
        try {
            const { email, password, first_name, middle_name, last_name } = req.body;

            // Check if user already exists but is unverified
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                if (existingUser.is_verified) {
                    return res.status(400).json({
                        message: 'Email already registered. Please login instead.'
                    });
                } else {
                    // Update existing unverified user
                    const hashedPassword = await hash(password, 10);
                    const verificationToken = crypto.randomBytes(32).toString('hex');
                    const verificationExpires = new Date(Date.now() + 3600000); // 1 hour

                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            password_hash: hashedPassword,
                            first_name,
                            middle_name,
                            last_name,
                            verificationCode: verificationToken,
                            verificationExpires
                        }
                    });

                    // Send verification email with link
                    const verificationUrl = `localhost:3001/verify/${verificationToken}`;
                    const msg = {
                        to: email,
                        from: process.env.EMAIL_FROM,
                        subject: 'Verify Your Account',
                        html: `
                          <h2>Verify Your Account</h2>
                          <p>Thank you for registering! To complete your account setup, please click the link below:</p>
                          <p><a href="${verificationUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify My Account</a></p>
                          <p>Or copy and paste this URL into your browser:</p>
                          <p>${verificationUrl}</p>
                          <p>This link will expire in 1 hour.</p>
                          <p>If you did not request this, please ignore this email.</p>
                        `
                    };

                    await emailClient.send(msg);

                    return res.status(200).json({
                        message: 'Registration initiated. Please check your email for verification link.',
                        userId: existingUser.id
                    });
                }
            }

            // Create new user with verification token
            const hashedPassword = await hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationExpires = new Date(Date.now() + 3600000); // 1 hour

            const user = await prisma.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    first_name,
                    middle_name,
                    last_name,
                    is_verified: false,
                    verificationCode: verificationToken,
                    verificationExpires,
                    balance: 0
                }
            });

            // Send verification email with link
            const verificationUrl = `localhost:3001/verify/${verificationToken}`;
            const msg = {
                to: email,
                from: process.env.EMAIL_FROM,
                subject: 'Verify Your Account',
                html: `
                  <h2>Verify Your Account</h2>
                  <p>Thank you for registering! To complete your account setup, please click the link below:</p>
                  <p><a href="${verificationUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify My Account</a></p>
                  <p>Or copy and paste this URL into your browser:</p>
                  <p>${verificationUrl}</p>
                  <p>This link will expire in 1 hour.</p>
                  <p>If you did not request this, please ignore this email.</p>
                `
            };

            await emailClient.send(msg);

            return res.status(201).json({
                message: 'Registration initiated. Please check your email for verification link.',
                userId: user.id
            });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Error creating user' });
        }
    }

    static async verifyUser(req: Request, res: Response) {
        try {
            const { verificationToken } = req.params;

            // Find the user with matching token
            const user = await prisma.user.findFirst({
                where: {
                    verificationCode: verificationToken,
                    verificationExpires: {
                        gt: new Date() // Token hasn't expired
                    },
                    is_verified: false
                }
            });

            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired verification link' });
            }

            // Mark the user as verified and clear verification data
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    is_verified: true,
                    verificationCode: null,
                    verificationExpires: null
                }
            });

            // Generate JWT token for auto-login
            const jwtSecret: Secret = process.env.JWT_SECRET || 'default-secret';
            const jwtOptions: SignOptions = { expiresIn: 24 * 60 * 60 };
            const token = jwt.sign(
                { userId: user.id },
                jwtSecret,
                jwtOptions
            );

            // Send welcome email
            const welcomeMsg = {
                to: user.email,
                from: process.env.EMAIL_FROM,
                subject: 'Welcome to Our Platform!',
                html: `
                  <h2>Welcome ${user.first_name}!</h2>
                  <p>Your account has been successfully verified.</p>
                  <p>You can now enjoy all the features of our platform.</p>
                `
            };

            await emailClient.send(welcomeMsg);

            return res.status(200).json({
                message: 'Account verified successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    middle_name: user.middle_name,
                    last_name: user.last_name,
                    balance: user.balance
                }
            });
        } catch (error) {
            console.error('Verification error:', error);
            return res.status(500).json({ message: 'Error during account verification' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            if (!user.is_verified) {
                return res.status(403).json({
                    message: 'Account not verified. Please verify your email first.',
                    needsVerification: true,
                    userId: user.id
                });
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
                    first_name: user.first_name,
                    middle_name: user.middle_name,
                    last_name: user.last_name,
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