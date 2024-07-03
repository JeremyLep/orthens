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
            id: session.user.id,
            active: true,
        }
    });

    await prisma.user.update({
        data: {
            image: req.body.avatar,
        },
        where: {
            id: user.id,
        }
    });

    try {
        return res.status(200).json({ status: 200, data: 'Le profil a été mis à jour.' });
    } catch (error) {
        console.error('Error updating profile:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
