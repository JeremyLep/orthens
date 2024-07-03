import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { RoleType } from 'lib/constants/roleType';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ status: 401, error: 'Unauthorized' });
    }

    let whereStatement = {
        relation: {
            child: {
                id: req.query.id as string
            }
        }
    } as any;

    if (session.user.role !== RoleType.ROLE_ADMIN) {
        whereStatement = {
            relation: {
                users: {
                    some: {
                        id: session.user.id,
                        active: true
                    },
                },
                child: {
                    id: req.query.id as string
                }
            }
        };
    }

    try {
        const conversation = await prisma.conversation.findFirst({
            where: whereStatement,
            include: {
                relation: {
                    include: {
                        users: { where: {active: true}},
                        child: true
                    }
                }
            }
        });

        return res.status(200).json({ status: 200, data: conversation });
    } catch (error) {
        console.error('Error retrieving child conversation messages:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
