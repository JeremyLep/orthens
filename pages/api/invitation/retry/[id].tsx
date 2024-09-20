import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { sendMail } from 'lib/service/mailer/mailer';
import { templateEmail } from 'lib/service/mailer/templateEmail';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    try {
        const invitation = await prisma.invitation.findFirst({
            where: {
                invitedById: session.user.id,
                id: req.query.id as string
            },
            include: {
                relation: {
                    include: {
                        child: true,
                    }
                }
            }
        });

        if (!invitation) {
            return res.status(400).json({ status: 400, error: "L'invitation n'existe pas" });
        }

        const invitationUpdated = await prisma.invitation.update({
            where: {
                id: invitation.id
            },
            data: {
                lastRetry: new Date(),
                invitationCount: invitation.invitationCount + 1
            }
        });

        await sendMail(
            {
                email: invitation.email.toLowerCase()
            },
            templateEmail.RETRY_INVITATION_TEMPLATE,
            {
                email: invitation.email.toLowerCase(),
                profession: invitation.profession,
                invitedBy: session.user.name,
                childFirstname: invitation.relation.child.firstname,
                childLastname: invitation.relation.child.lastname,
                link: `${process.env.NEXTAUTH_URL}/invitations`
            }
        );

        return res.status(200).json({ status: 200, data: invitationUpdated });
    } catch (error) {
        console.error('Error retrieving invitations recieved list:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
