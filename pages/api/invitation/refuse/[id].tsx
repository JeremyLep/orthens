import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { invitationStatus } from 'lib/provider/invitation/invitationStatus';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    try {
        const invitation = await prisma.invitation.findFirst({
            where: {
                email: session.user.email,
                id: req.query.id as string
            },
            include: {
                relation: true,
            }
        });

        if (!invitation) {
            return res.status(400).json({ status: 400, error: "L'invitation n'existe pas" });
        }

        await prisma.invitation.update({
            where: {
                id: invitation.id
            },
            data: {
                status: invitationStatus.REFUSED
            }
        });

        return res.status(200).json({ status: 200, data: invitation });
    } catch (error) {
        console.error('Error retrieving invitations recieved list:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
