"use server"
import { db as prisma } from "@/lib/db";
import { loadCategoriesOrder } from "@/lib/localStorage";

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
        console.log(category)
        const createCategory = await prisma.category.create({
            data: {
                name: category,
                establishmentId: id as string
            },

        })
        return { success: "Criado com sucesso!" }

    } catch (err) {
        console.log(err)
        return { error: "ocorreu um erro!" }
    }


}

export const updateAllCategoriesPosition = async (establishmentId: string, newCategoryOrder: { id: string; order: number }[]) => {
    try {
        for (const { id, order } of newCategoryOrder) {
            await prisma.category.update({
                where: { id: id },
                data: { order: order },
            });
        }

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