import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { create } from 'superstruct';
import { RelationInvitationInput } from 'lib/model/struct/invitation/relationInvitationInput';
import { Invitation, User } from '@prisma/client';
import { templateEmail } from 'lib/service/mailer/templateEmail';
import { sendMail } from 'lib/service/mailer/mailer';
import { invitationStatus } from 'lib/provider/invitation/invitationStatus';
import { createAlert } from 'lib/service/alert/createAlert';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    try {
        const inviteInput = create(req.body, RelationInvitationInput);

        const relation = await prisma.relation.findUniqueOrThrow({
            where: {
                id: inviteInput.relationId,
                users: {
                    some: {
                        id: session.user.id
                    }
                },
                archived: false,
            },
            include: {
                child: true,
            }
        });

        let result: {
            userInvited: User[],
            invitationCreated: Invitation[]
        } = {
            userInvited: [],
            invitationCreated: [],
        };

        for (let index = 0; index < inviteInput.invitations.length; index++) {
            const invitation = inviteInput.invitations[index];

            const existingUser = await prisma.user.findFirst({
                where: {
                    email: invitation.email,
                },
            });
            
            const invitationCreated = await prisma.invitation.create({
                data: {
                    email: invitation.email,
                    status: invitationStatus.PENDING,
                    profession: invitation.profession,
                    invitedBy: {
                        connect: {
                            id: session.user.id,
                        },
                    },
                    relation: {
                        connect: {
                            id: relation.id,
                        },
                    },
                },
                include: {
                    invitedBy: true,
                },
            });

            await sendMail(
                {
                    email: invitation.email,
                },
                templateEmail.INVITATION_TEMPLATE,
                {
                    email: invitation.email,
                    profession: invitation.profession,
                    invitedBy: session.user.name,
                    childFirstname: relation.child.firstname,
                    childLastname: relation.child.lastname,
                    link: `${process.env.NEXTAUTH_URL}/invitations`
                }
            )

            result.invitationCreated.push(invitationCreated);

            if (existingUser) {
                await createAlert('invitation', existingUser.id, {professional: invitationCreated.invitedBy, child: relation.child});
            }
        }

        return res.status(200).json({ status: 200, data: result });
    } catch (error) {
        console.error('Error inviting user:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
