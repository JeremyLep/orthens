import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
    }

    const childId = req.query.id as string;

    if (!childId) {
        return res.status(400).json({ status: 400, error: 'Child ID is required' });
    }

    try {
        const files = await prisma.file.findMany({
            where: {
                OR: [
                    {
                        relation: {
                            users: {
                                some: {
                                    id: session.user.id
                                }
                            },
                            child: {
                                id: childId
                            }
                        },
                    },
                    {
                        conversationMessage: {
                            conversation: {
                                relation: {
                                    users: {
                                        some: {
                                            id: session.user.id
                                        }
                                    },
                                    child: {
                                        id: childId
                                    }
                                }
                            }
                        }
                    },
                    {
                        followUpMessage: {
                            relation: {
                                users: {
                                    some: {
                                        id: session.user.id
                                    }
                                },
                                child: {
                                    id: childId
                                }
                            }
                        }
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({ status: 200, data: files });
    } catch (error) {
        console.error('Error retrieving child files:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
