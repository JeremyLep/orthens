import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { create } from 'superstruct';
import { StudentInput } from 'lib/model/struct/student/studentInput';
import { sendMail } from 'lib/service/mailer/mailer';
import { templateEmail } from 'lib/service/mailer/templateEmail';
import { invitationStatus } from 'lib/provider/invitation/invitationStatus';
import { createAlert } from 'lib/service/alert/createAlert';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    try {
        const studentInput = create(req.body, StudentInput);


        const childCreated = await prisma.child.create({
            data: {
                firstname: studentInput.firstname,
                lastname: studentInput.lastname,
                birthYear: studentInput.birthYear,
                institution: studentInput.institution,
                createdBy: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
            include: {
                createdBy: true,
            },
        });

        const relationCreated = await prisma.relation.create({
            data: {
                child: {
                    connect: {
                        id: childCreated.id,
                    },
                },
                users: {
                    connect: [
                        {
                            id: session.user.id,
                        },
                    ],
                },
            },
        });

        const conversationCreated = await prisma.conversation.create({
            data: {
                relation: {
                    connect: {
                        id: relationCreated.id,
                    },
                },
            },
        });

        const invitationsCreated = await prisma.invitation.createMany({
            data: studentInput.professionals.map((professional) => {
                return {
                    email: professional.email,
                    relationId: relationCreated.id,
                    profession: professional.profession,
                    invitedById: session.user.id,
                    status: invitationStatus.PENDING,
                }
            })
        });

        for (let index = 0; index < studentInput.professionals.length; index++) {
            const professional = studentInput.professionals[index];

            await sendMail(
                {
                    email: professional.email,
                },
                templateEmail.INVITATION_TEMPLATE,
                {
                    email: professional.email,
                    profession: professional.profession,
                    invitedBy: session.user.name,
                    childFirstname: childCreated.firstname,
                    childLastname: childCreated.lastname,
                    link: `${process.env.NEXTAUTH_URL}/invitations`
                }
            )

            const existingUser = await prisma.user.findFirst({
                where: {
                    email: professional.email,
                },
            });

            if (existingUser) {
                await createAlert('invitation', existingUser.id, {professional: childCreated.createdBy, child: childCreated});
            }
        }
        

        return res.status(200).json({ status: 200, data: {
            child: childCreated,
            relation: relationCreated,
            conversation: conversationCreated,
            invitations: invitationsCreated,
        }});
    } catch (error) {
        console.error('Error creating child relation conversation:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
