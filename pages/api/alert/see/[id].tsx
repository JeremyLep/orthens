import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    const id = parseInt(req.query.id as string);

    try {
        const alert = await prisma.alert.findFirst({
            where: {
                id: id
            },
        });

        if (!alert) {
            return res.status(404).json({ status: 404, error: "L'alerte n'existe pas" });
        }

        await prisma.alert.update({
            where: {
                id: alert.id
            },
            data: {
                seen: true
            }
        });

        return res.status(200).json({ status: 200, data: alert });
    } catch (error) {
        console.error('Error updating alert:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
