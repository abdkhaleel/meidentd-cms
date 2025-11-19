import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/auth/login',
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if(!user) {
                    return null;
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {

        jwt({ token, user}) {
            if (user) {
                token.role = (user as any).role;
                token.username = (user as any).username;
            }
            return token;
        },

        session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.sub;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };