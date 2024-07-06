"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "../../../auth";
import { CredentialsSchema } from "../../../schemas/auth";
import { z } from "zod";

export const login = async (credentials: z.infer<typeof CredentialsSchema>) => {
	
	try {

		const resp = await signIn("credentials", {
			...credentials,
            redirectTo: "/dashboard",
		});
		console.log(resp);
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