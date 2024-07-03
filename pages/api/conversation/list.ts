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
        const conversations = await prisma.conversation.findMany({
            where: {
                relation: {
                    users: {
                        some: {
                            id: session.user.id,
                            active: true
                        },
                    }
                }
            },
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
                },
            }
        });

        return res.status(200).json({ status: 200, data: conversations });
    } catch (error) {
        console.error('Error retrieving conversations list:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
