import prisma from 'lib/service/orm/prisma';
import { encodePassword } from 'lib/service/utils/passwordManager';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
      const { userId, data: {password, verifiedPassword} } = req.body;

      if (!userId || !password || !verifiedPassword) {
          return res.status(400).json({ message: "Tous les champs sont requis." });
      }

      if (password !== verifiedPassword) {
          return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
      }
      
      const user = await prisma.user.findFirst({where: {id: userId}});

      if (!user) {
          return res.status(400).json({ message: "Le compte n'existe pas." });
      }
      const hashedPassword = await encodePassword(password);

      await prisma.user.update({
        data: {
          password: hashedPassword,
        },
        where: {
          id: userId,
        }
      });

      return res.status(200).json({ status: 200, email: user.email });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error.message });
    }
}
