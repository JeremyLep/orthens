import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { RoleType } from 'lib/constants/roleType';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
    }

    let whereStatement = {
        relation: {
            child: {
                id: req.query.child as string
            }
        }
    } as any;

    if (session.user.role !== RoleType.ROLE_ADMIN) {
        whereStatement = {
            relation: {
                users: {
                    some: {
                        id: session.user.id,
                        active: true
                    }
                },
                child: {
                    id: req.query.child as string
                }
            }
        }
    }

    try {
        const followUpMessages = await prisma.followUpMessage.findMany({
            where: whereStatement,
            orderBy: {
                date: 'desc'
            },
            include: {
                createdBy: true,
                relation: true,
                files: true,
            }
        });

        return res.status(200).json({ status: 200, data: followUpMessages });
    } catch (error) {
        console.error('Error retrieving follow-up messages:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
