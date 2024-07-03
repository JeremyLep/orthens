import { UpdateProfileInput } from 'lib/model/struct/account/updateProfileInput';
import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { create } from 'superstruct';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    const input = create(req.body, UpdateProfileInput);

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
            active: true,
        }
    });

    await prisma.user.update({
        data: {
            name: input.name,
            profession: input.profession,
            institution: input.institution,
            phone: input.phone,
            postcode: input.postcode,
            city: input.city,
            address: input.address,
            isPhonePublic: input.isPhonePublic,
            isAddressPublic: input.isAddressPublic,
        },
        where: {
            id: user.id,
        }
    });

    try {
        return res.status(200).json({ status: 200, data: 'Le profil a été mis à jour.' });
    } catch (error) {
        console.error('Error updating profile:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
