"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default async function Home() {
    const route = useRouter()

    return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <Button onClick={()=>route.push('/auth/login')}>LOGAR</Button>
            </main>
    );
}
