import Credentials from "next-auth/providers/credentials";

import { NextAuthConfig } from "next-auth"
import bcrypt from "bcrypt"
import { db as prisma } from "./src/lib/db"

export default {
	providers: [
		Credentials({
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
                    throw new Error('erro de credenciais')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email as string
                    }
                })
                if (!user || !user.hashedPassword) {
                    throw new Error('não registrado!')
                }

                const matchedPassword = await bcrypt.compare(credentials.password as string, user.hashedPassword )

                if (!matchedPassword) {
                    throw new Error('Senha incorreta!')
                }
                return user
			},
		}),

	],

} satisfies NextAuthConfig;