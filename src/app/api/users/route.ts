import { db as prisma } from "../../../lib/db"

import bcryptjs from "bcryptjs"


import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

    const data = await request.json()
    const { email, password } = data

    if (!email || !password) {
        return NextResponse.json("Dados inválidos.", { status: 400 })
    }

    const isUserExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (isUserExists) {
        return NextResponse.json({ error: "E-mail já existente." }, { status: 400 })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)


    const user = await prisma.user.create({
        data: {
            email,
            hashedPassword
        }
    })
    
    return NextResponse.json(user)
}