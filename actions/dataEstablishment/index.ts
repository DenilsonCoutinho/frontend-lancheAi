"use server"
import { z } from "zod";
import { db as prisma } from "@/lib/db";
import { DataEstablishmentSchema } from "../../schemas/auth";
import { verificationEstablishmentExist } from "../../services/dataEstablishment";
import { redirect } from "next/navigation";
import { auth } from "../../auth";



export const createDataEstablishment = async (credentials: z.infer<typeof DataEstablishmentSchema>, id: string, imageUrl?: string) => {
    const session = await auth()
    const validCredentials = DataEstablishmentSchema.safeParse(credentials)
    const idEstablishmentNameId = credentials.name.replaceAll(" ", "-")

    if (!validCredentials || !id) {
        return {
            error: "Dados Inválidos!"
        }
    }

    const verifyEstablishmentExist: any = await verificationEstablishmentExist(id)

    if (verifyEstablishmentExist) {
        return {
            error: "Você já tem um estabelecimento criado!"
        }
    }
    try {
        const createEstablishment = await prisma.establishment.create(
            {
                data: {
                    name: credentials.name,
                    contact: credentials.contact,
                    idEstablishment: id,
                    logo: imageUrl,
                    idEstablishmentName: idEstablishmentNameId
                }
            }
        )

        // const oneHourInMilliseconds = 60 * 60 * 1000;  // 1 hora em milissegundos
        // const currentTime = new Date();  // Hora atual
        // const timeDifference = Number(currentTime) - verifyEstablishmentExist?.createdAt //cacular
        // if (timeDifference > oneHourInMilliseconds) {

        return { success: "Criado com sucesso!" }


    } catch (error) {
        return { error: "Algo deu errado!" }
    }
}
