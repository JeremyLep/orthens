import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
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
        id: req.query.id as string,
        archived: false,
    } as any;

    if (session.user.role !== RoleType.ROLE_ADMIN) {
        whereStatement = {
            ...whereStatement,
            relations: {
                some: {
                    users: {
                        some: {
                            id: session.user.id
                        }
                    }
                }
            }
        };
    }

    try {
        const child = await prisma.child.findUniqueOrThrow({
            where: whereStatement,
            include: {
                createdBy: true,
                relations: {
                    include: {
                        users: {
                            where: {active: true}
                        },
                        invitations: true,
                    }
                },
            }
        });

        return res.status(200).json({ status: 200, data: child });
    } catch (error) {
        console.error('Error retrieving student:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
