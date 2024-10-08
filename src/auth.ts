import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import  db  from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/load-game',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, _) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const existingUser = await db.user.findUnique({
                    where: {
                        username: credentials.username
                    }
                });
                if (!existingUser || !existingUser.password) {
                    return null;
                }

                const passwordMatch = await compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                    return null;
                }

                return {
                    id: `${existingUser.id}`,
                    username: existingUser.username,
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    id: token.id
                }
            }
        },
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    username: user.username,
                    id: user.id
                }
            }
            return token
        }
    }
}