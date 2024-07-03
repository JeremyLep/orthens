import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { RoleType } from 'lib/constants/roleType';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);


    let whereStatement = {
        conversation: {
            id: req.query.id as string,
        }
    } as any;

    if (req.query.from && req.query.from !== '0') {
        whereStatement = {
            ...whereStatement,
            createdAt: {
                gt: new Date(req.query.from as string)
            }
        }
    }

    if (session.user.role !== RoleType.ROLE_ADMIN) {
        whereStatement = {
            ...whereStatement,
            conversation: {
                id: req.query.id as string,
                relation: {
                    users: {
                        some: {
                            id: session.user.id,
                            active: true
                        }
                    }
                }
            }
        };
    }

    try {
        const conversationMessages = await prisma.conversationMessage.findMany({
            where: whereStatement,
            include: {
                conversation: {
                    include: {
                        relation: {
                            include: {
                                users: {
                                    where: {
                                        active: true
                                    }
                                },
                                child: true
                            }
                        }
                    }
                },
                files: true,
                createdBy: true
            },
            take: 60,
            orderBy: {
                createdAt: 'asc'
            }
        });

        return res.status(200).json({ status: 200, data: conversationMessages });
    } catch (error) {
        console.error('Error retrieving conversation messages:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
