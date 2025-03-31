import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

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

    static async getTransactions(req: Request, res: Response) {
        try {
            const user_id = req.user?.userId
            const transactions = await prisma.transaction.findMany({
                where: { user_id: user_id },
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

            // Get current month
            const today = new Date();
            const currentMonthStart = startOfMonth(today);
            const currentMonthEnd = endOfMonth(today);

            // Get previous month
            const previousMonthStart = startOfMonth(subMonths(today, 1));
            const previousMonthEnd = endOfMonth(subMonths(today, 1));

            // Get current month transactions
            const currentMonthTransactions = await prisma.transaction.findMany({
                where: {
                    user_id: userId,
                    date: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd
                    }
                }
            });

            // Get previous month transactions
            const previousMonthTransactions = await prisma.transaction.findMany({
                where: {
                    user_id: userId,
                    date: {
                        gte: previousMonthStart,
                        lte: previousMonthEnd
                    }
                }
            });

            // Calculate stats for current month
            const currentMonthIncome = currentMonthTransactions
                .filter(t => t.type.toLowerCase() === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const currentMonthExpenses = currentMonthTransactions
                .filter(t => t.type.toLowerCase() === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const currentMonthBalance = currentMonthIncome - currentMonthExpenses;

            // Calculate stats for previous month
            const previousMonthIncome = previousMonthTransactions
                .filter(t => t.type.toLowerCase() === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const previousMonthExpenses = previousMonthTransactions
                .filter(t => t.type.toLowerCase() === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const previousMonthBalance = previousMonthIncome - previousMonthExpenses;

            // Calculate percentage changes
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
                    expenses: currentMonthExpenses,
                    balance: currentMonthBalance
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
        console.log("called method in controller")
        try {
            const user_id = req.user?.userId;
            const { transactionId } = req.params;
            console.log(transactionId, user_id)

            if (!user_id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Find the transaction to get the amount and type
            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId },
                select: { amount: true, type: true, user_id: true }
            });

            if (!transaction || transaction.user_id !== user_id) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            // Calculate balance adjustment
            const balanceChange = transaction.type.toLowerCase() === 'income'
                ? new Prisma.Decimal(transaction.amount).negated() // Subtract income
                : new Prisma.Decimal(transaction.amount); // Add back expense

            // Start a transaction to delete and update balance
            await prisma.$transaction(async (prismaClient) => {
                await prismaClient.transaction.delete({
                    where: { id: transactionId },
                });

                await prismaClient.user.update({
                    where: { id: user_id },
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
}