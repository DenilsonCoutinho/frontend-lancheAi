"use server"
import { db as prisma } from "@/lib/db";


export async function createCategory(category: string, id: string | null) {

    if (!category) {
        return { error: "Algo deu errado!" }
    }

    try {
        await prisma.category.create({
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

export async function editNameCategoryByid(id: string, newNameCategory: string,) {
    console.log(" categoria:" + newNameCategory, " id:" + id)

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name: newNameCategory
            }
        })
    } catch (error) {

    }
}

export const updateAllCategoriesPosition = async (newCategoryOrder: { id: string; order: number }[]) => {
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
        await prisma.category.delete({
            where: { id }
        })
        return { success: "Categoria deletada com sucesso!" }
    } catch (error) {
        return { error: 'Algo deu errado!' }
    }
}