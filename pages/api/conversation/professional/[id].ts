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

    if (!session) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
    }

    const professionalId = req.query.id as string;

    let whereStatement: any = {
        relation: {
            users: {
                some: {
                    id: professionalId,
                    active: true
                }
            }
        }
    };

    if (session.user.role !== RoleType.ROLE_ADMIN) {
        whereStatement = {
            AND: [
                {
                    relation: {
                        users: {
                            some: {
                                id: session.user.id,
                                active: true
                            }
                        }
                    }
                },
                {
                    relation: {
                        users: {
                            some: {
                                id: professionalId,
                                active: true
                            }
                        }
                    }
                }
            ]
        };
    }

    try {
        const conversations = await prisma.conversation.findMany({
            where: whereStatement,
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
        });

        return res.status(200).json({ status: 200, data: conversations });
    } catch (error) {
        console.error('Error retrieving professional conversations list:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
