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

    static async getTag(req: Request, res: Response) {
        try {
            const userId = req.user?.userId

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" })
            }

            const { tagId } = req.params

            if (!tagId) {
                return res.status(400).json({ message: "Tag ID is required" })
            }

            const tag = await prisma.tag.findUnique({
                where: {
                    id: tagId
                }
            })

            if (!tag) {
                return res.status(404).json({ message: "Tag not found" })
            }

            if (tag.user_id !== userId) {
                return res.status(403).json({ message: "User not authorized" })
            }

            return res.status(202).json({ tag })
        } catch (error) {
            console.error("Error getting single tag:", error)
            return res.status(500).json({ message: "Error retrieving tag" })
        }
    }

    static async getAllTags(req: Request, res: Response) {
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

    static async deleteTag(req: Request, res: Response) {
        try {
            const userId = req.user?.userId
            const { tagId } = req.params;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const tag = await prisma.tag.findUnique({
                where: { id: tagId },
            });

            if (!tag) {
                return res.status(404).json({ message: 'Tag not found' });
            }

            if (tag.user_id !== userId) {
                return res.status(403).json({ message: 'Not authorized to delete this tag' });
            }

            await prisma.tag.delete({
                where: { id: tagId },
            });
            return res.status(200).json({ message: 'Tag deleted successfully' });
        } catch (error) {
            console.error('Delete tag error:', error);
            return res.status(500).json({ message: 'Error deleting tag', error });
        }
    }

    static async updateTag(req: Request, res: Response) {
        try {
            const userId = req.user?.userId
            const { tagId } = req.params;
            const { name, color, icon } = req.body;

            const tag = await prisma.tag.findUnique({
                where: { id: tagId },
            });

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!tag) {
                return res.status(404).json({ message: 'Tag not found' });
            }

            if (tag.user_id !== userId) {
                return res.status(403).json({ message: 'Not authorized to delete this tag' });
            }

            const updatedTag = await prisma.tag.update({
                where: { id: tagId },
                data: {
                    name,
                    color,
                    icon
                }
            });

            return res.status(200).json({
                message: 'Tag updated successfully',
                tag: updatedTag
            });
        } catch (error) {
            console.error('Update tag error:', error);
            return res.status(500).json({ message: 'Error updating tag', error });
        }
    }
}