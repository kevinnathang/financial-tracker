import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class TagController {
    static async createTag(req: Request, res: Response) {
        try {
            const { name, icon, color } = req.body;

            const existingTag = await prisma.tag.findFirst({ where: { name } })
            if (existingTag) {
                return res.status(400).json({ message: 'Tag already exists' });
            }

            const tag = await prisma.tag.create({
                data: {
                    name,
                    icon,
                    color
                }
            });

            return res.status(201).json({
                message: 'Tag created successfully',
                tag: {
                    id: tag.id,
                    name: tag.name,
                    color: tag.color,
                    icon: tag.icon
                }
            });
        } catch (error) {
            console.error('Tag creation error:', error);
            return res.status(500).json({ message: 'Error creating tag', error });
        }
    }
}