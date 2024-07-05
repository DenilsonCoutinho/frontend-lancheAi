import { z } from 'zod'

export const CredentialsSchema = z.object({
    email: z.string().email({message: "Email inválido!"}),
    password: z.string().min(6,{message:"A senha deve conter mais que 6 caracteres!"}),
})