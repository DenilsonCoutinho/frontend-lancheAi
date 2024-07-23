"use server"
import bcryptjs from 'bcryptjs';
import { z } from "zod"
import { CredentialsSchemaResetPassword, NewPasswordSchema } from "../../../schemas/auth"
import { findUserbyEmail } from "../../../services";
import { createResetPasswordToken, deleteResetPasswordToken, findResetPasswordTokenByToken, updatePassword } from "../../../services/auth/password-reset-request";
import { useToast } from "@/components/ui/use-toast"

const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "contact.denilsoncoutinho@gmail.com",
		pass: process.env.PASSWORDNODEMAILER
	},
	port: 587,
});

export const resetPassword = async (values: z.infer<typeof CredentialsSchemaResetPassword>) => {
    const validatedEmail = CredentialsSchemaResetPassword.safeParse(values);

    if (!validatedEmail.success) {
        return { error: "E-mail inválido" };
    }
    const { email } = validatedEmail.data;

    const existingUser = await findUserbyEmail(email);
    if (!existingUser) {
        return { error: "Usuário não encontrado" };
    }
    const tokenUser = await createResetPasswordToken(email)
    await sendAccountVerificationPassword(tokenUser.email ,tokenUser.token)
    return { success: "Verifique seu email" };

}


export default async function sendAccountVerificationPassword(emailUser: string,token:string){
    const { VERIFICATION_SUBJECT, NEXT_PUBLIC_URL, VERIFICATION_URL_PASSWORD } = process.env;
	if (!VERIFICATION_SUBJECT || !NEXT_PUBLIC_URL || !VERIFICATION_URL_PASSWORD) {
		return {
			error: "Configuração de ambiente insuficiente para envio de e-mail.",
		};
	}

	const verificationUrl = `${NEXT_PUBLIC_URL}${VERIFICATION_URL_PASSWORD}?token=${token}`;
	

	try {

		const sendMail = await transporter.sendMail({
			from: '1 Igreja batista de joinville <contact.denilsoncoutinho@gmail.com>', // sender address
			to: emailUser, // list of receivers
			subject: VERIFICATION_SUBJECT, // Subject line
			html: `<p>Clique <a href="${verificationUrl}">aqui</a> para redefinir sua senha.</p>`,
		});

		return {
			success: "E-mail enviado com sucesso",
		};
	} catch (error) {
		
		return { error };
	}
}


export const changePassword = async (passwordData: z.infer<typeof NewPasswordSchema>, token: string | null) => {
	if (!token) {
		return { error: "Token não encontrado" };
	}

	const validatedPassword = NewPasswordSchema.safeParse(passwordData);

	if (!validatedPassword.success) {
		return { error: "Dados inválidos" };
	}

	const { password } = validatedPassword.data;

	const existingToken = await findResetPasswordTokenByToken(token);
	if (!existingToken) {
		return { error: "Token inválido" };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();
	if (hasExpired) {
		return { error: "Token Expirado" };
	}

	const existingUser = await findUserbyEmail(existingToken.email);
	if (!existingUser) {
		return { error: "Usuário não encontrado" };
	}

	const hashedPassword = await bcryptjs.hash(password, 10);

	await updatePassword(existingUser.id, hashedPassword);

	await deleteResetPasswordToken(existingToken.id);

	return { success: "Senha atualizada" };
};