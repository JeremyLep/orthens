import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
    }

    try {
        const professional = await prisma.user.findUniqueOrThrow({
            where: {
                id: req.query.id as string,
                active: true,
            },
        });

        return res.status(200).json({ status: 200, data: professional });
    } catch (error) {
        console.error('Error retrieving professional:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
