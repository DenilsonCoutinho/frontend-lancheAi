import { CredentialsSignin } from "next-auth";

class InvalidCredentials extends CredentialsSignin {
	code = "Credenciais Inválidas";
}

export { InvalidCredentials };
