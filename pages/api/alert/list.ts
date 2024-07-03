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
        const alerts = await prisma.alert.findMany({
            where: {
                user: {
                    id: session.user.id,
                    active: true
                },
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20,
        });

        return res.status(200).json({ status: 200, data: alerts });
    } catch (error) {
        console.error('Error retrieving alerts list:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
