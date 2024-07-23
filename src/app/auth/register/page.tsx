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
import { LoaderIcon } from "lucide-react";
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { CredentialsSchemaRegister } from "../../../../schemas/auth"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { register } from "../../../../actions/auth/register"
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
export default function Register() {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
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
        const credentialValidate = CredentialsSchemaRegister.safeParse(values);
        if (!credentialValidate?.success) {
            return { error: "Dados inválidos" };
        }
        startTransition(async () => {


            const { error, success } = await register(values)

            if (error) {
                toast({
                    title: error,
                    description: ":(",
                    action: <ToastAction altText="ok">ok</ToastAction>,
                    className: "bg-red-500 relative text-white",

                })
            }
            if (success) {
                toast({
                    title: "Registro Efetuado com sucesso!",
                    description: "Verifique seu email!",
                    action: <ToastAction onClick={() => router.push('/auth/login')} altText="ir para a Tela de login">ok </ToastAction>,
                    className: "bg-green-500 relative text-white",
                })
                await new Promise(resolve => setTimeout(resolve, 3000))
                router.push('/auth/login')
            }
        })


    }

    function toLogin() {
        router.push('/auth/login')
    }
    return (
        <main className="flex min-h-screen flex-col  justify-center items-center ">
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

                            <Button disabled={isPending} className="bg-orange-500 w-full hover:bg-orange-400">
                                <LoaderIcon className={!isPending ? "hidden" : "animate-spin mr-2"} />
                                Registrar
                            </Button>
                        </CardFooter>
                    </form>
                    {!isPending && <CardFooter className="items-center justify-center">
                        <p>Já possui conta? <span onClick={() => toLogin()} className="text-blue-500 cursor-pointer">Clique aqui</span></p>
                    </CardFooter>}
                </Form>
            </Card>
        </main>

    )
}
