"use server"
import { db as prisma } from "@/lib/db";

export const getCategories = async (establishmentId: string) => {
    const categoriesData = await prisma.category.findMany({
        where: {
            establishmentId
        },
        include:{
            items:true,
        }
    });

    return categoriesData
}

