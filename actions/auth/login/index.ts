"use server";
import { db as prisma } from "../../../src/lib/db";
import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "../../../auth";
import { CredentialsSchema } from "../../../schemas/auth";
import { z } from "zod";
import bcryptjs from "bcryptjs"

export const login = async (credentials: z.infer<typeof CredentialsSchema>) => {

	const validCredentials = CredentialsSchema.safeParse(credentials)

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

		const userExist = await findUserbyEmail(email);

		if (!userExist) {
			return {
				error: "Usuário não encontrado",
			};
		}

		const validPassword = await bcryptjs.compare(password, userExist?.hashedPassword as string);

		if (!validPassword) {
			return {
				error: "Senha ou email incorreto!"
			}
		}

		await signIn("credentials", {
			email,
			password,
			// redirectTo: '/dashboard'
		},);
		
		

	} catch (err) {

		if (err instanceof AuthError) {
			if (err instanceof CredentialsSignin) {
				return {
					error: "Credenciais inválidas",
				};
			}
		}

		throw err;
	}
};