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
        const relations = await prisma.relation.findMany({
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        files: true,
                        followUpMessages: true,
                    }
                },
                users: {where: {active: true}},
                invitations: true,
                child: true,
            },
            where: {
                users: {
                    some: {
                        id: session.user.id
                    }
                },
                archived: false
            },
        });

        return res.status(200).json({ status: 200, data: relations });
    } catch (error) {
        console.error('Error retrieving relations list:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
