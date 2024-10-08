import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    });

    await prisma.user.update({
        data: {
            active: false,
        },
        where: {
            id: user.id,
        }
    });

    try {
        return res.status(200).json({ status: 200, data: 'Le compte a été supprimé.' });
    } catch (error) {
        console.error('Error deleting account:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
