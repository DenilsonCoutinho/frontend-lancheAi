"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useForm } from "react-hook-form"
import { CredentialsSchema } from "../../../../schemas/auth"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Suspense, useState, useTransition } from "react"
import { login } from "../../../../actions/auth/login"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LoaderIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Login() {
    const { toast } = useToast()
   
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [cover, setCover] = useState<boolean>(false);

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
    async function onSubmit(values: z.infer<typeof CredentialsSchema>) {
        startTransition(async () => {
            const res = await login(values);

            if (!res?.error) {
                toast({
                    title: "Login Efetuado com sucesso!",
                    description: "Aguarde...",
                    action: <ToastAction altText="Try again">ok</ToastAction>,
                    className: "bg-green-500 relative text-white",

                })
                setError("");
            }

            if (res?.error) {
                setError(res?.error);
                toast({
                    title: res?.error,
                    description: ":(",
                    action: <ToastAction altText="Try again">ok</ToastAction>,
                    className: "bg-red-500 relative text-white",

                })
                setSuccess("");
                form.reset();
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 2000))
            router.push('/dashboard')
        })
    }


    return (
        <main className=" flex min-h-screen  flex-col items-center  justify-center">
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
                                                placeholder="Seuemail@gmail.com"
                                                disabled={isPending}
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
                                        <div className="relative">
                                            <div onClick={() => setCover(!cover)} className="absolute right-2 pt-3">
                                                {
                                                    cover ?
                                                        <FaEye />
                                                        :
                                                        <FaEyeSlash />
                                                }
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type={cover ? 'text' : 'password'}
                                                    placeholder="Sua senha"
                                                    required
                                                    {...field}
                                                    disabled={isPending}
                                                />

                                            </FormControl>
                                        </div>
                                        <FormMessage  />
                                    </FormItem>
                                )}
                            />

                        </CardContent>
                        <CardFooter className=" flex-col items-center">
                            <Button disabled={isPending} className="bg-orange-500 w-full hover:bg-orange-400">
                                <LoaderIcon className={!isPending ? "hidden" : "animate-spin mr-2"} />
                                Entrar</Button>
                            {!isPending && <>
                                <div onClick={() => toRegister()} className="cursor-pointer w-full">
                                    <p className="text-md pt-4 text-black text-center">
                                        Registre-se
                                    </p>
                                </div>
                                <Link href={'/auth/password-reset-request'}>
                                    <p className="text-md pt-4 text-black text-center">
                                        Esqueci minha senha
                                    </p>
                                </Link>
                            </>}
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </main>
    )
}
