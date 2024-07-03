import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { create } from 'superstruct';
import moment from 'moment';
import { FollowUpInput } from 'lib/model/struct/followUp/followUpInput';
import { createAlert } from 'lib/service/alert/createAlert';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    try {
        const followUpInput = create(req.body, FollowUpInput);

        const relation = await prisma.relation.findUniqueOrThrow({
            where: {
                id: followUpInput.relationId,
                users: {
                    some: {
                        id: session.user.id
                    }
                }
            },
            include: {
                child: true,
                users: true
            }
        });

        const followUpmessageCreated = await prisma.followUpMessage.create({
            data: {
                message: followUpInput.message,
                date: moment.utc(`${followUpInput.date} ${followUpInput.time}`).toDate(),
                relation: {
                    connect: {
                        id: relation.id,
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
                relation: true,
                files: true
            }
        });

        for (let index = 0; index < relation.users.length; index++) {
            const target = relation.users[index];

            if (target.id === session.user.id) {
                continue;
            }


            await createAlert('new-follow-up', target.id, {professional: followUpmessageCreated.createdBy, child: relation.child});   
        }

        return res.status(200).json({ status: 200, data: followUpmessageCreated});
    } catch (error) {
        console.error('Error creating child relation conversation:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
