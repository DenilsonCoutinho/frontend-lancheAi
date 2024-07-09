import { CredentialsSignin } from "next-auth";

class UserNotFound extends CredentialsSignin {
	code = "Usuário não encontrado";
}

export { UserNotFound };
