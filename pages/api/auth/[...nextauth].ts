import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedinProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from 'lib/service/orm/prisma';
import { decodePassword, encodePassword } from 'lib/service/utils/passwordManager';
import { User } from '@prisma/client';

export const authOptions: NextAuthOptions = {
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // }),
        // LinkedinProvider({
        //     clientId: process.env.LINKEDIN_CLIENT_ID,
        //     clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        // }),
        CredentialsProvider({
            name: "Credentials",
            type: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@email.fr" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email.toLowerCase(),
                        active: true
                    }
                });

                if (!user || !await decodePassword(credentials.password, user.password)) {
                    return null;
                } else {
                    return user;
                }
            }
        })
        /*EmailProvider({
            server: process.env.SMTP_SERVER,
            from: process.env.SMTP_SENDER,
            sendVerificationRequest({ identifier, url }) {
                sendMail(
                    identifier,
                    'Subject',
                    url
                );
            },
        }),*/
    ],
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: `/auth/sign-in`,
        newUser: `/registration/step-1`,
    },
    callbacks: {
        async session({ session, user, token }) {
            session.user.email = token.email.toLowerCase();
            session.user.name = token.name;
            session.user.id = token.sub;
            session.user.image = token.picture;
            session.user.role = token.role;

            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            } else if (new URL(url).origin === baseUrl) {
                return url;
            }

            return baseUrl;
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.role = user.role;
            }

            return token
        }
    },
    events: {
        createUser: async ({ user }) => {
            console.log('new user created', user);
        },
    },
};

const authHandler: NextApiHandler = NextAuth(authOptions);

export default authHandler;


