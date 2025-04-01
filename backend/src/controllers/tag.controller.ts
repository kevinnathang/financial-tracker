import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class TagController {
    static async createTag(req: Request, res: Response) {
        try {
            const { name, icon, color } = req.body;
            const user_id = req.user?.userId

            if (!user_id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!name || !color) {
                return res.status(400).json({ message: 'Name and color are required' });
            }

            const existingTag = await prisma.tag.findFirst({
                where: {
                    name,
                    user_id
                }
            });

            if (existingTag) {
                return res.status(400).json({ message: 'Tag already exists for this user' });
            }

            const tag = await prisma.tag.create({
                data: {
                    name,
                    icon,
                    color,
                    user: {
                        connect: { id: user_id }
                    }
                }
            });

            return res.status(201).json({
                message: 'Tag created successfully',
                tag: {
                    id: tag.id,
                    name: tag.name,
                    color: tag.color,
                    icon: tag.icon,
                    user_id: tag.user_id
                }
            });
        } catch (error) {
            console.error('Tag creation error:', error);
            return res.status(500).json({ message: 'Error creating tag', error });
        }
    }

    static async getTags(req: Request, res: Response) {
        try {
            const user_id = req.user?.userId

            if (!user_id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }


            const tags = await prisma.tag.findMany({
                where: { user_id: user_id }
            })

            return res.status(200).json({
                tags
            });
        } catch (error) {
            console.error('Get tags error:', error);
            return res.status(500).json({ message: 'Error retrieving tags', error });
        }
    }
}