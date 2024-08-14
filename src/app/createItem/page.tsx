"use client"
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  useRouter, useSearchParams } from "next/navigation";

export default function CreateItem() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const route = useRouter()

    return (
        <div className="">
            <div className="bg-bgOrangeDefault  h-6 w-full">
                <p className="text-white max-w-[1200px] m-auto">Lancha AI</p>
            </div>
            <Card className="max-w-[1200px] m-auto mt-4 w-full ">
                <CardHeader>
                    <CardTitle className="text-2xl">Seus itens</CardTitle>
                    <CardDescription>
                        Cadastre seu itens abaixo
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card className="max-w-[1200px] m-auto mt-4 w-full ">

            </Card>
            {/* {id}
            <Button onClick={()=>route.push("/menu-food")}>Voltar</Button> */}
        </div>
    )
}