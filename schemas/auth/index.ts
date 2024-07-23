import { z } from 'zod'

export const CredentialsSchema = z.object({
    email: z.string().email({ message: "Email inválido!" }),
    password: z.string()
})


export const CredentialsSchemaRegister = z.object({
    email: z.string().email({ message: "Email inválido!" }),
    password: z.string().min(6, { message: "A senha deve conter mais que 6 digitos!" }),
    passwordConfirm: z.string(),

}).refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirm'], // Caminho do campo que receberá a mensagem de erro
});

export const CredentialsSchemaResetPassword = z.object({
    email: z.string().email({ message: "Email inválido!" }),
})

export const NewPasswordSchema = z.object({
	password: z.string().min(6,{message: "A senha deve conter mais que 6 digitos!"}),
});
