"use server"
import { db as prisma } from "@/lib/db";

export default async function createCategory(category: string, id: string | null) {

    if (!category) {
        return { error: "Algo deu errado!" }
    }

    try {
        const createCategory = await prisma.category.create({
            data: {
                name: category,
                establishmentId: id as string
            },

        })
        return { success: "Criado com sucesso!" }

    } catch (err) {

        return { error: "ocorreu um erro!" }
    }


}