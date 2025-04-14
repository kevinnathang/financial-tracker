import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

export class TransactionController {
    static async createTransaction(req: Request, res: Response) {
        try {
            const { tag_id, financial_geopoint_id, amount, type, description, date } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!amount || !type) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: ['amount', 'type']
                });
            }

            const numericAmount = new Prisma.Decimal(amount);
            const transactionDate = date ? new Date(date) : new Date();

            const result = await prisma.$transaction(async (prismaClient) => {
                const newTransaction = await prismaClient.transaction.create({
                    data: {
                        user_id: userId,
                        tag_id,
                        financial_geopoint_id,
                        amount: numericAmount,
                        type,
                        description,
                        date: transactionDate,
                    },
                });

                const balanceChange = type.toLowerCase() === 'income' ? numericAmount : numericAmount.negated();

                const updatedUser = await prismaClient.user.update({
                    where: { id: userId },
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

    static async getAllTransactions(req: Request, res: Response) {
        try {
            const userId = req.user?.userId
            const transactions = await prisma.transaction.findMany({
                where: { user_id: userId },
                include: {
                    tag: true,
                    financialGeopoint: true,
                },
                orderBy: {
                    date: 'desc'
                }
            })
            return res.json({ transactions })

        } catch (error) {
            console.error('Get transactions error:', error);
            return res.status(500).json({ message: 'Error retrieving transactions' });
        }
    }

    static async getMonthlyStats(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const today = new Date();
            const currentMonthStart = startOfMonth(today);
            const currentMonthEnd = endOfMonth(today);

            const previousMonthStart = startOfMonth(subMonths(today, 1));
            const previousMonthEnd = endOfMonth(subMonths(today, 1));

            const currentMonthTransactions = await prisma.transaction.findMany({
                where: {
                    user_id: userId,
                    date: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd
                    }
                }
            });

            const previousMonthTransactions = await prisma.transaction.findMany({
                where: {
                    user_id: userId,
                    date: {
                        gte: previousMonthStart,
                        lte: previousMonthEnd
                    }
                }
            });

            const currentMonthIncome = currentMonthTransactions
                .filter(t => t.type.toLowerCase() === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const currentMonthExpenses = currentMonthTransactions
                .filter(t => t.type.toLowerCase() === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const currentMonthBalance = currentMonthIncome - currentMonthExpenses;

            const previousMonthIncome = previousMonthTransactions
                .filter(t => t.type.toLowerCase() === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const previousMonthExpenses = previousMonthTransactions
                .filter(t => t.type.toLowerCase() === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const previousMonthBalance = previousMonthIncome - previousMonthExpenses;

            const calculatePercentageChange = (current: number, previous: number) => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return ((current - previous) / previous) * 100;
            };

            const incomeChange = calculatePercentageChange(currentMonthIncome, previousMonthIncome);
            const expensesChange = calculatePercentageChange(currentMonthExpenses, previousMonthExpenses);
            const balanceChange = calculatePercentageChange(currentMonthBalance, previousMonthBalance);

            return res.status(200).json({
                currentMonth: {
                    income: currentMonthIncome,
                    expenses: currentMonthExpenses
                },
                previousMonth: {
                    income: previousMonthIncome,
                    expenses: previousMonthExpenses,
                    balance: previousMonthBalance
                },
                percentageChanges: {
                    income: Number(incomeChange.toFixed(1)),
                    expenses: Number(expensesChange.toFixed(1)),
                    balance: Number(balanceChange.toFixed(1))
                }
            });
        } catch (error) {
            console.error('Get monthly stats error:', error);
            return res.status(500).json({ message: 'Error retrieving monthly statistics' });
        }
    }

    static async deleteTransaction(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { transactionId } = req.params;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId },
                select: { amount: true, type: true, user_id: true }
            });

            if (!transaction || transaction.user_id !== userId) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            const balanceChange = transaction.type.toLowerCase() === 'income'
                ? new Prisma.Decimal(transaction.amount).negated()
                : new Prisma.Decimal(transaction.amount);

            await prisma.$transaction(async (prismaClient) => {
                await prismaClient.transaction.delete({
                    where: { id: transactionId },
                });

                await prismaClient.user.update({
                    where: { id: userId },
                    data: {
                        balance: {
                            increment: balanceChange,
                        },
                    },
                });
            });

            return res.status(200).json({ message: 'Transaction deleted successfully' });

        } catch (error) {
            console.error('Delete transaction error:', error);
            return res.status(500).json({ message: 'Error deleting transaction', error });
        }
    }

    static async updateTransaction(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { transactionId } = req.params;
            const { tag_id, financial_geopoint_id, amount, type, description, date } = req.body;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!amount || !type) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: ['amount', 'type']
                });
            }

            const existingTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId },
                select: { amount: true, type: true, user_id: true, date: true }
            });

            if (!existingTransaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            if (existingTransaction.user_id !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const newAmount = new Prisma.Decimal(amount);
            const newType = type.toLowerCase();
            const transactionDate = date ? new Date(date) : existingTransaction.date;

            let balanceAdjustment = new Prisma.Decimal(0);

            if (existingTransaction.type.toLowerCase() === 'income') {
                balanceAdjustment = balanceAdjustment.minus(existingTransaction.amount);
            } else {
                balanceAdjustment = balanceAdjustment.plus(existingTransaction.amount);
            }

            if (newType === 'income') {
                balanceAdjustment = balanceAdjustment.plus(newAmount);
            } else {
                balanceAdjustment = balanceAdjustment.minus(newAmount);
            }

            const result = await prisma.$transaction(async (prismaClient) => {
                const updatedTransaction = await prismaClient.transaction.update({
                    where: { id: transactionId },
                    data: {
                        tag_id,
                        financial_geopoint_id,
                        amount: newAmount,
                        type,
                        description,
                        date: transactionDate,
                    },
                    include: {
                        tag: true,
                        financialGeopoint: true,
                    }
                });

                const updatedUser = await prismaClient.user.update({
                    where: { id: userId },
                    data: {
                        balance: {
                            increment: balanceAdjustment,
                        },
                    },
                    select: {
                        balance: true
                    }
                });

                return {
                    transaction: updatedTransaction,
                    balance: updatedUser.balance
                };
            });

            return res.status(200).json({
                message: 'Transaction updated successfully',
                transaction: result.transaction,
                balance: result.balance
            });

        } catch (error) {
            console.error('Update transaction error:', error);
            return res.status(500).json({ message: 'Error updating transaction', error });
        }
    }
}