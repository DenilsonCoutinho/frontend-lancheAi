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
import { CredentialsSchema } from "../../../../schemas/auth"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormEvent, useTransition } from "react"
import { login } from "../../../../actions/auth/login"
import { redirect, useRouter } from "next/navigation"
export default function Login() {
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof CredentialsSchema>>({
        resolver: zodResolver(CredentialsSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const router = useRouter()
    function toRegister() {
        router.push('/auth/register')

    }
    async function onSubmit(values: z.infer<typeof CredentialsSchema>,) {

        const resp = await login(values);
    }

    return (
        <main className="flex min-h-screen flex-col items-center pt-24 justify-between">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Insira seus dados abaixo para fazer login.
                    </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
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
                                                placeholder="seuemail@gmail.com"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </CardContent>

                        <CardFooter className=" flex-col items-center">
                            <Button  disabled={false} className="bg-orange-500 w-full hover:bg-orange-400">Entrar</Button>
                            <p className="text-gray-400 pt-5"> ou</p>
                        </CardFooter>
                    </form>
                    <CardFooter className="">
                        <Button variant="secondary" onClick={() => toRegister()} disabled={false} className="w-full">Registre-se</Button>
                    </CardFooter>
                </Form>
            </Card>
        </main>

    )
}
