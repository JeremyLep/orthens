import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { create } from 'superstruct';
import { ConversationMessageInput } from 'lib/model/struct/conversation/conversationMessageInput';
import { createAlert } from 'lib/service/alert/createAlert';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    try {
        const input = create(req.body, ConversationMessageInput);

        const conversationMessage = await prisma.conversationMessage.create({
            data: {
                message: input.message,
                conversation: {
                    connect: {
                        id: req.query.id as string,
                    },
                },
                createdBy: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
            include: {
                createdBy: true,
                files: true,
                conversation: {
                    include: {
                        relation: {
                            include: {
                                users: {
                                    where: {
                                        active: true,
                                    },
                                },
                                child: true,
                            },
                        },
                    },
                },
            }
        });

        for (let index = 0; index < conversationMessage.conversation.relation.users.length; index++) {
            const target = conversationMessage.conversation.relation.users[index];

            if (target.id === session.user.id) {
                continue;
            }


            await createAlert('new-message', target.id, {professional: conversationMessage.createdBy, child: conversationMessage.conversation.relation.child});
        }

        return res.status(200).json({ status: 200, data: conversationMessage });
    } catch (error) {
        console.error('Error retrieving conversation messages:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
