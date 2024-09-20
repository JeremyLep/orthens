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
        const invitations = await prisma.invitation.findMany({
            where: {
                email: session.user.email.toLowerCase(),
                status: {
                    not: 'DELETED'
                }
            },
            include: {
                invitedBy: true,
                relation: {
                    include: {
                        users: {
                            where: {
                                active: true
                            }
                        },
                        child: true,
                        invitations: true
                    }
                }
            }
        });

        return res.status(200).json({ status: 200, data: invitations });
    } catch (error) {
        console.error('Error retrieving invitations recieved list:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
