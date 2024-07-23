import Credentials from "next-auth/providers/credentials";

import { NextAuthConfig } from "next-auth"
import bcryptjs from "bcryptjs"
import { db as prisma } from "./src/lib/db"
import { CredentialsSchema } from "./schemas/auth";
import { UserNotFound } from "./lib/user-not-found";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const findUserbyEmail = async (email: string) => {
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        },
                    });
                    return user;
                };

                const validdCredentials = CredentialsSchema.safeParse(credentials);
                if (validdCredentials.success) {
                    const { email, password } = validdCredentials.data;
                    const user = await findUserbyEmail(email);
                    if (!user || !user.hashedPassword) {
                        throw new UserNotFound();
                    }
                    const validPassword = await bcryptjs.compare(password, user.hashedPassword);
                    if (validPassword) return user;
                }
                return null;

            },
        }),

    ],

} satisfies NextAuthConfig;