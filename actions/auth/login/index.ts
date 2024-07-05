"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "../../../auth";
import { CredentialsSchema } from "../../../schemas/auth";
import { z } from "zod";

export const login = async (credentials: z.infer<typeof CredentialsSchema>) => {
	
	try {

        console.log(credentials)
		const resp = await signIn("credentials", {
			credentials,
            redirectTo:"/dashboard"
		});
	} catch (err) {
		if (err instanceof AuthError) {
			if (err instanceof CredentialsSignin) {
				return {
					error: "Credenciais inválidas",
				};
			}
		}

		throw err; // Rethrow all other errors
	}
};