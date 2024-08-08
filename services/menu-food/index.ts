"use server"
import { db as prisma } from "@/lib/db";

export const getCategories = async (establishmentId: string) => {

    const establishmentExist = await prisma.category.findMany({
        where: {
            establishmentId
        }
    });

    return establishmentExist
}

interface categoryProps {
    id: string
    name?: string
    establishmentId?: string
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