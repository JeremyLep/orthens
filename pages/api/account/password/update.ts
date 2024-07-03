import { UpdatePasswordInput } from 'lib/model/struct/account/updatePasswordInput';
import prisma from 'lib/service/orm/prisma';
import { decodePassword, encodePassword } from 'lib/service/utils/passwordManager';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { create } from 'superstruct';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    const input = create(req.body, UpdatePasswordInput);

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
            active: true,
        },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
        }
    });

    const decodedPassord = await decodePassword(input.oldPassword, user.password);

    if (!decodedPassord) {
        return res.status(400).json({ message: "L'ancien mot de passe est incorrect." });
    }

    if (input.password !== input.verifiedPassword) {
        return res.status(400).json({ message: "Les nouveaux mots de passe ne correspondent pas." });
    }

    const hashedPassword = await encodePassword(input.password);

    await prisma.user.update({
        data: {
            password: hashedPassword,
        },
        where: {
            id: user.id,
        }
    });

    try {
        return res.status(200).json({ status: 200, data: 'Le mot de passe a été mis à jour.' });
    } catch (error) {
        console.error('Error retrieving session:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
