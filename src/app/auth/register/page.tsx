"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { CredentialsSchema, CredentialsSchemaRegister } from "../../../../schemas/auth"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
export default function Register() {
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof CredentialsSchemaRegister>>({
        resolver: zodResolver(CredentialsSchemaRegister),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: ""
        }
    })
    const router = useRouter()
    async function onSubmit(values: z.infer<typeof CredentialsSchemaRegister>) {
        console.log(values)

        const request = await fetch("/api/users", {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password
            })
        })

        const response = await request.json()

        if (!request.ok) {
            alert("Erro interno!")
        } else {
            router.push('/auth/login')
        }
    }

    function toRegister() {
        router.push('/auth/login')
    }
    return (
        <main className="flex min-h-screen flex-col  pt-24 items-center justify-between">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Registrar</CardTitle>
                    <CardDescription>
                        Insira seus dados abaixo para fazer seu registro.
                    </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="seuemail@gmail.com"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Digite sua senha"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="passwordConfirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirme sua senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Digite sua senha novamente"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </CardContent>

                        <CardFooter>
                            <Button disabled={false} className="bg-orange-500 w-full hover:bg-orange-400">Registrar</Button>

                        </CardFooter>
                    </form>
                    <CardFooter className="items-center justify-center">
                        <p>Já possui conta? <span onClick={() => toRegister()} className="text-blue-500 cursor-pointer">Clique aqui</span></p>
                    </CardFooter>
                </Form>
            </Card>
        </main>

    )
}
