"use server"
import { z } from "zod";
import { db as prisma } from "@/lib/db";
import { DataEstablishmentSchema } from "../../schemas/auth";


export const createDataEstablishment = async (credentials: z.infer<typeof DataEstablishmentSchema>, id: string, imageUrl?: string) => {

    const validCredentials = DataEstablishmentSchema.safeParse(credentials)

    if (!validCredentials) {
        return {
            error: "Dados Inválidos!"
        }
    }
    try {
        const createEstablishment = await prisma.establishment.create(
            {
                data: {
                    name: credentials.name,
                    contact: credentials.contact,
                    idEstablishment: id,
                    logo: imageUrl
                }
            }
        )
        return { success: "Criado com sucesso!" }

    } catch (error) {
        return { error: "Algo deu errado!" }
    }
}
