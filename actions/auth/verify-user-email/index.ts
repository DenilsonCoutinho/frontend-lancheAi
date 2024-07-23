"use server"

import type { User } from "@prisma/client";
import { findVerificationTokenbyToken } from "../../../services/auth/verify-user-email";

import { db as prisma } from "@/lib/db";
import { findUserbyEmail } from "../../../services";
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "contact.denilsoncoutinho@gmail.com",
		pass: process.env.PASSWORDNODEMAILER
	},
	port: 587,
});

export const sendAccountVerificationEmail = async (user: User, token: string) => {
	const { VERIFICATION_SUBJECT, NEXT_PUBLIC_URL, VERIFICATION_URL } = process.env;
	if (!VERIFICATION_SUBJECT || !NEXT_PUBLIC_URL || !VERIFICATION_URL) {
		return {
			error: "Configuração de ambiente insuficiente para envio de e-mail.",
		};
	}

	const verificationUrl = `${NEXT_PUBLIC_URL}${VERIFICATION_URL}?token=${token}`;
	const { email } = user;

	try {

		const sendMail = await transporter.sendMail({
			from: '1 Igreja batista de joinville <contact.denilsoncoutinho@gmail.com>', // sender address
			to: email, // list of receivers
			subject: VERIFICATION_SUBJECT, // Subject line
			html: `<p>Clique <a href="${verificationUrl}">aqui</a> para confirmar seu e-mail.</p>`,
		});

		return {
			success: "E-mail enviado com sucesso",
		};
	} catch (error) {

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

	const user = await findUserbyEmail(existingToken.email);
	if (!user) {
		return {
			error: "Usuário não encontrado",
		};
	}

	try {
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