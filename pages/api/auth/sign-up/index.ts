import { CreateAccountInput } from 'lib/model/struct/account/createAccountInput';
import { sendMail } from 'lib/service/mailer/mailer';
import { templateEmail } from 'lib/service/mailer/templateEmail';
import prisma from 'lib/service/orm/prisma';
import { encodePassword } from 'lib/service/utils/passwordManager';
import type { NextApiRequest, NextApiResponse } from 'next';
import { create } from 'superstruct';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 405, error: 'Method Not Allowed' });
    }

    const input = create(req.body, CreateAccountInput);

    try {
        if (input.password !== input.confirmPassword) {
            return res.status(400).json({ status: 400, error: 'Passwords do not match' });
        }

        const userExist = await prisma.user.findFirst({
            where: {
                email: input.email.toLowerCase() as string,
                active: true,
            },
        });

        if (userExist) {
            return res.status(400).json({ status: 400, error: 'Cet email existe déjà' });
        }

        const user = await prisma.user.create({
            data: {
                email: input.email.toLowerCase() as string,
                password: await encodePassword(input.password as string),
                name: input.name as string,
                profession: input.profession as string,
                institution: input.institution as string,
            },
        });

        await sendMail(
            {
                email: user.email.toLowerCase(),
                name: user.name,
            },
            templateEmail.WELCOME_TEMPLATE,
            {
                name: user.name,
                email: user.email.toLowerCase(),
            }
        )

        return res.status(200).json({ status: 200, data: user });
    } catch (error) {
        console.error('Error creating account:', error);

        return res.status(500).json({ status: 500, error: error.message });
    }
}
