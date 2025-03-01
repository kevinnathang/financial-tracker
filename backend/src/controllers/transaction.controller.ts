import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class TransactionController {
    static async createTransaction(req: Request, res: Response) {
        try {
            const { tag_id, financial_geopoint_id, amount, type, description, date } = req.body;
            const user_id = req.user?.userId;

            if (!user_id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Validate required fields
            if (!amount || !type) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: ['amount', 'type']
                });
            }

            const numericAmount = new Prisma.Decimal(amount);
            const transactionDate = date ? new Date(date) : new Date();

            // Start a transaction to ensure both operations succeed or fail together
            const result = await prisma.$transaction(async (prismaClient) => {
                // Create the transaction
                const newTransaction = await prismaClient.transaction.create({
                    data: {
                        user_id: user_id,
                        tag_id,
                        financial_geopoint_id,
                        amount: numericAmount,
                        type,
                        description,
                        date: transactionDate,
                    },
                });

                // Update user balance
                const balanceChange = type.toLowerCase() === 'income' ? numericAmount : numericAmount.negated();

                const updatedUser = await prismaClient.user.update({
                    where: { id: user_id },
                    data: {
                        balance: {
                            increment: balanceChange,
                        },
                    },
                    select: {
                        balance: true
                    }
                });

                return {
                    transaction: newTransaction,
                    balance: updatedUser.balance
                };
            });

            return res.status(201).json({
                message: 'Transaction created successfully',
                transaction: result.transaction,
                balance: result.balance
            });

        } catch (error) {
            console.error('Create transaction error:', error);
            return res.status(500).json({ message: 'Error creating transaction' });
        }
    }
}