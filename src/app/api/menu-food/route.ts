import { db as prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

import { NextRequest, NextResponse } from "next/server"

export const getCategories = async (establishmentId: string) => {

    const establishmentExist = await prisma.category.findMany({
        where: {
            establishmentId
        }
    });

    return establishmentExist
}

export async function GET(request: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(request.url);
    const establishmentId = searchParams.get('establishmentId');

    try {
        const categories = await getCategories(establishmentId as string);
        
       return NextResponse.json( categories , { status: 200 })
        
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }
}