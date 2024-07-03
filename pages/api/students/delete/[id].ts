import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    try {
        const child = await prisma.child.update({
            where: {
                id: req.query.id as string,
                createdBy: {
                    id: session.user.id
                }
            },
            data: {
                archived: true,
                relations: {
                    updateMany: {
                        where: {
                            childId: req.query.id as string
                        },
                        data: {
                            archived: true
                        }
                    }
                }
            }
        });

        return res.status(200).json({ status: 200, data: child });
    } catch (error) {
        console.error('Error retrieving student:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
