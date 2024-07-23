"use client"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";


export default function Dashboard() {
    const [data, setData] = useState<Session | null>()

    async function getData() {
        const dataUser = await getSession()
        setData(dataUser)
    }

    const route = useRouter()

    useEffect(() => {

        getData()

    }, [])

    if (data === null) {
        route.push('/')
    }else{
        route.push('/dashboard')

    }
 

    return <p>
        {JSON.stringify(data)}
        <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign In</Button>
    </p>
}