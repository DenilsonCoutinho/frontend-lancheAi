"use server"
import mail from "@/lib/resend";
import type { User } from "@prisma/client";
import { findVerificationTokenbyToken } from "../../../services/auth/verify-user-email";

import { db as prisma } from "@/lib/db";
import { findUserbyEmail } from "../../../services";


export const sendAccountVerificationEmail = async (user: User, token: string) => {
	const { RESEND_EMAIL_FROM, VERIFICATION_SUBJECT, NEXT_PUBLIC_URL, VERIFICATION_URL } = process.env;
	if (!RESEND_EMAIL_FROM || !VERIFICATION_SUBJECT || !NEXT_PUBLIC_URL || !VERIFICATION_URL) {
		return {
			error: "Configuração de ambiente insuficiente para envio de e-mail.",
		};
	}

	const verificationUrl = `${NEXT_PUBLIC_URL}${VERIFICATION_URL}?token=${token}`;
	const { email } = user;
	try {
		const { data, error } = await mail.emails.send({
			from: RESEND_EMAIL_FROM,
			to: email || "",
			subject: VERIFICATION_SUBJECT,
			html: `<p>Clique <a href="${verificationUrl}">aqui</a> para confirmar seu e-mail.</p>`,
		});

		if (error)
			return {
				error,
			};
		return {
			success: "E-mail enviado com sucesso",
		};
	} catch (error) {
		console.log(error);
		return { error };
	}
};



export const verifyToken = async (token: string) => {


	const existingToken = await findVerificationTokenbyToken(token);
	
	if (!existingToken) {
		return {
			error: "Código de verificação não encontrado",
		};
	}

	const isTokenExpired = new Date(existingToken.expires) < new Date();
	if (isTokenExpired) {

		return {
			error: "Código de verificação expirado",
		};
	}
	console.log('cvai aqui tb,')

	const user = await findUserbyEmail(existingToken.email);
	if (!user) {
		return {
			error: "Usuário não encontrado",
		};
	}

	try {
		console.log('Ta updatando...')
		await prisma.user.update({
			where: { id: user.id },
			data: {
				emailVerified: new Date(),
			},
		});

		await prisma.verificationTokenUser.delete({
			where: {
				id: existingToken.id,
			},
		});

		return {
			success: "E-mail verificado",
		};
	} catch (err) {
		return { error: "Erro ao atualizar verificação de e-mail" };
	}
};