import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: session.user.id,
                active: true,
            },
        });

        return res.status(200).json({ status: 200, data: user });
    } catch (error) {
        console.error('Error retrieving profile:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
