import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

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
                                }
                            }
                        }
                    },
                    {
                        createdBy: {
                            id: session.user.id
                        }
                    }
                ],
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({ status: 200, data: files });
    } catch (error) {
        console.error('Error retrieving files list:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
