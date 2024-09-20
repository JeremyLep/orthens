import prisma from 'lib/service/orm/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { sendMail } from 'lib/service/mailer/mailer';
import { templateEmail } from 'lib/service/mailer/templateEmail';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { email } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (!user) {
          return res.status(400).json({ status: 400, data: "L'adresse email n'existe pas." });
        }

        const userToken = jwt.sign({id: user.id}, process.env.RESET_TOKEN_SECRET, {
            expiresIn: "1h",
        });

        const url = `${process.env.NEXTAUTH_URL}/account/reset-password/${userToken}`;

        await sendMail(
          {
            email: user.email.toLowerCase(),
            name: user.name,
          },
          templateEmail.RESET_PASSWORD_TEMPLATE,
          {
            name: user.name,
            url: url,
          }
        );
        
        return res.status(200).json({ status: 200, data: 'Vous avez reçu un email pour renouveller votre mot de passe' });
      } catch (error) {
        console.error('Error sending reset password email:', error);
        return res.status(500).json({ status: 500, message: error.message });
      }
}
