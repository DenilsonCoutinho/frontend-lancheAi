"use server"
import { db as prisma } from "@/lib/db";

interface categoryProps {
    id: string
    name?: string
    establishmentId?: string
}

export async function createCategory(category: string, id: string | null) {

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

export const updateAllCategoriesPosition = async (establishmentId: string, categoriesData: any) => {
    try {
        await prisma.$transaction(async () => {

            await prisma.category.deleteMany({
                where: { establishmentId },
            });

            await prisma.category.createMany({
                data: categoriesData.map((category: categoryProps) => ({
                    ...category,
                    name: category.name,
                    establishmentId: establishmentId
                })),
            });
        })

        return { success: "Categorias atualizada com sucesso" }
    } catch (error) {
        return { error: 'Error ao atualizar posição' }
    }
}

export const deleteCategory = async (id: string) => {
    if (!id) {
        return { error: 'Algo deu errado!' }
    }

    try {
        const deletedCategory = await prisma.category.delete({
            where: { id }
        })
        return { success: "Categoria deletada com sucesso!" }
    } catch (error) {
        return { error: 'Algo deu errado!' }
    }
}