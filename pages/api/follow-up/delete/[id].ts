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
        const followUpMessage = await prisma.followUpMessage.findFirst({
            where: {
                id: req.query.id as string,
            },
        });

        if (!followUpMessage) {
            return res.status(404).json({ status: 404, error: "L'evenement n'a pas été trouvé" });
        }

        await prisma.followUpMessage.delete({
            where: {
                id: req.query.id as string,
            },
        });

        return res.status(200).json({ status: 200, data: followUpMessage });
    } catch (error) {
        console.error('Error retrieving follow-up messages:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
