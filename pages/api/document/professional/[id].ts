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

    const professionalId = req.query.id as string;

    try {
        const files = await prisma.file.findMany({
            where: {
                OR: [
                    {
                        relation: {
                            users: {
                                some: {
                                    id: session.user.id,
                                },
                            },
                        },
                        AND: {
                            relation: {
                                users: {
                                    some: {
                                        id: professionalId,
                                    },
                                },
                            },
                        },
                    },
                    {
                        conversationMessage: {
                            conversation: {
                                relation: {
                                    users: {
                                        some: {
                                            id: session.user.id,
                                        },
                                    },
                                },
                            },
                        },
                        AND: {
                            conversationMessage: {
                                conversation: {
                                    relation: {
                                        users: {
                                            some: {
                                                id: professionalId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        followUpMessage: {
                            relation: {
                                users: {
                                    some: {
                                        id: session.user.id,
                                    },
                                },
                            },
                        },
                        AND: {
                            followUpMessage: {
                                relation: {
                                    users: {
                                        some: {
                                            id: professionalId,
                                        },
                                    },
                                },
                            },
                        },
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
