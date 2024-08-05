"use server"
import { z } from "zod";
import { db as prisma } from "@/lib/db";
import { DataEstablishmentSchema } from "../../schemas/auth";
import { verificationEstablishmentExist } from "../../services/dataEstablishment";



export const createDataEstablishment = async (credentials: z.infer<typeof DataEstablishmentSchema>, id: string, imageUrl?: string) => {

    const validCredentials = DataEstablishmentSchema.safeParse(credentials)

    if (!validCredentials) {
        return {
            error: "Dados Inválidos!"
        }
    }

    const verifyEstablishmentExist = await verificationEstablishmentExist(id)
    if (verifyEstablishmentExist) {
        return {
            error:"Você já tem um estabelecimento criado!"
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
