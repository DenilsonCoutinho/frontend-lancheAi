"use server";
import { db as prisma } from "../../../src/lib/db";
import { CredentialsSchemaRegister } from "../../../schemas/auth";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcryptjs from 'bcryptjs';
import { createVerificationToken } from "../../../services/auth/verify-user-email";
import { sendAccountVerificationEmail } from "../verify-user-email";

export const register = async (credentials: z.infer<typeof CredentialsSchemaRegister>) => {

    const validCredentials = CredentialsSchemaRegister.safeParse(credentials)

    const findUserbyEmail = async (email: string) => {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    };

    if (!validCredentials.success) {
        return {
            error: "Dados Inválidos!"
        }
    }
    try {
        const { email, password } = validCredentials.data;

        const hashedPassword = await bcryptjs.hash(password, 10)
        const userExist = await findUserbyEmail(email);

        if (userExist) {
            return {
                error: "Email já existente!",
            };
        }

        const createdUser = await prisma.user.create({
            data: {
                email,
                hashedPassword
            }
        })

        const verificationToken = await createVerificationToken(email);

        await sendAccountVerificationEmail(createdUser, verificationToken.token);
        return {
            success: "E-mail de verificação enviado",
        };

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    error: "Já existe uma conta relacionada a este e-mail.",
                };
            }
        }

        throw error;
    }
};