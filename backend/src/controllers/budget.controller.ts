import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { connect } from "http2";

export class BudgetController {
    static async createBudget(req: Request, res: Response) {
        try {
            const { name, amount, period, start_date, end_date, is_main, description } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!amount || !name) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: ['amount', 'name']
                });
            }

            const numericAmount = new Prisma.Decimal(amount);

            if (is_main) {
                await prisma.budget.updateMany({
                    where: { user_id: userId, is_main: true },
                    data: { is_main: false }
                });
            }

            const newBudget = await prisma.budget.create({
                data: {
                    name,
                    amount: numericAmount,
                    period,
                    start_date: new Date(start_date),
                    end_date: end_date ? new Date(end_date) : null,
                    is_main: is_main || false,
                    description,
                    user: {
                        connect: { id: userId }
                    }
                },
            });

            return res.status(201).json({
                message: 'Budget created successfully',
                newBudget

            });

        } catch (error) {
            console.error('Create budget error:', error);
            return res.status(500).json({ message: 'Error creating budget' });
        }
    }

    static async getBudget(req: Request, res: Response) {
        try {
            const userId = req.user?.userId

            if (!userId) {
                return res.json(401).json({ message: "Unauthorized" })
            }

            const { budgetId } = req.params

            if (!budgetId) {
                return res.status(400).json({ message: 'Budget ID is required' });
            }

            const budget = await prisma.budget.findUnique({
                where: {
                    id: budgetId
                }
            })

            if (!budget) {
                return res.status(404).json({ message: "Budget not found" })
            }

            if (budget.user_id !== userId) {
                return res.status(403).json({ message: "User not authorized" })
            }

            return res.status(200).json({ budget })
        } catch (error) {
            console.error("Error getting single budget:", error)
            return res.status(500).json({ message: 'Error retrieving budget' });
        }
    }

    static async getBudgets(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const budgets = await prisma.budget.findMany({
                where: { user_id: userId },
                select: {
                    id: true,
                    name: true,
                    amount: true,
                    period: true,
                    start_date: true,
                    end_date: true,
                    is_main: true,
                    description: true,
                    created_at: true,
                    updated_at: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            })
            return res.json({ budgets })

        } catch (error) {
            console.error('Get budgets error:', error);
            return res.status(500).json({ message: 'Error retrieving budgets' });
        }
    }

    static async deleteBudget(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { budgetId } = req.params;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const budget = await prisma.budget.findUnique({
                where: { id: budgetId },
                select: { user_id: true }
            });

            if (!budget || budget.user_id !== userId) {
                return res.status(404).json({ message: 'Budget not found' });
            }

            await prisma.budget.delete({
                where: { id: budgetId },
            });

            return res.status(200).json({ message: 'Budget deleted successfully' });

        } catch (error) {
            console.error('Delete budget error:', error);
            return res.status(500).json({ message: 'Error deleting budget', error });
        }
    }

    static async updateBudget(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { budgetId } = req.params;
            const { name, amount, period, start_date, end_date, is_main, description } = req.body;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!amount || !name) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: ['amount', 'name']
                });
            }

            const existingBudget = await prisma.budget.findUnique({
                where: { id: budgetId },
                select: { user_id: true }
            });

            if (!existingBudget) {
                return res.status(404).json({ message: 'Budget not found' });
            }

            if (existingBudget.user_id !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }

            if (is_main) {
                await prisma.budget.updateMany({
                    where: {
                        user_id: userId,
                        is_main: true,
                        id: { not: budgetId }
                    },
                    data: { is_main: false }
                });
            }

            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (amount !== undefined) updateData.amount = new Prisma.Decimal(amount);
            if (period !== undefined) updateData.period = period;
            if (start_date !== undefined) updateData.start_date = new Date(start_date);
            if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date) : null;
            if (is_main !== undefined) updateData.is_main = is_main;
            if (description !== undefined) updateData.description = description;

            const updatedBudget = await prisma.budget.update({
                where: { id: budgetId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    amount: true,
                    period: true,
                    start_date: true,
                    end_date: true,
                    is_main: true,
                    description: true,
                    created_at: true,
                    updated_at: true
                }
            });

            return res.status(200).json({
                message: 'Budget updated successfully',
                updatedBudget
            });

        } catch (error) {
            console.error('Update budget error:', error);
            return res.status(500).json({ message: 'Error updating budget', error });
        }
    }

    static async getMainBudget(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const mainBudget = await prisma.budget.findFirst({
                where: {
                    user_id: userId,
                    is_main: true
                }
            });

            if (!mainBudget) {
                return res.status(404).json({ message: 'No main budget found' });
            }

            return res.json({ mainBudget });

        } catch (error) {
            console.error('Get main budget error:', error);
            return res.status(500).json({ message: 'Error retrieving main budget' });
        }
    }
}