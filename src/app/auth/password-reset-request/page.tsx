"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CredentialsSchemaResetPassword } from "../../../../schemas/auth";
import { z } from "zod";
import { resetPassword } from "../../../../actions/auth/password-reset-request";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";

export default function PasswordReset() {

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [loading, setLoading] = useState<boolean | undefined>(false);
    const router = useRouter()

    const form = useForm<z.infer<typeof CredentialsSchemaResetPassword>>({
        resolver: zodResolver(CredentialsSchemaResetPassword),
        defaultValues: {
            email: "",
        }
    })


    async function onSubmit(values: z.infer<typeof CredentialsSchemaResetPassword>,) {
        startTransition(async () => {
            setLoading(true)

            const { error, success } = await resetPassword(values)
            if (success) {
                setSuccess(success)
            }
            if (success) {
                setError(error)
            }
            setLoading(true)
        })


    }
    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <Card className="w-full max-w-sm">
                    {!loading ? <>
                        <CardHeader>
                            <CardTitle className="text-2xl">Insira seu email</CardTitle>
                            <CardDescription>
                                Insira seu email para receber o código de recuperação
                            </CardDescription>
                        </CardHeader>

                        <Form
                            {...form}>
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
                                
                                </CardContent>
                                <CardFooter className=" flex-col items-center">
                                    <Button disabled={isPending} className="bg-orange-500 w-full hover:bg-orange-400">
                                        <LoaderIcon className={!isPending ? "hidden" : "animate-spin mr-2"} />
                                        Enviar</Button>
                                </CardFooter>
                            </form>
                            <CardFooter className="">
                            </CardFooter>
                        </Form> </>
                        :
                        <>
                            <CardHeader>
                                <CardTitle className="text-2xl">Verifique seu email</CardTitle>
                                <CardDescription>
                                    Você provavelmente recebeu um código de recuperação
                                </CardDescription>

                            </CardHeader>
                            <CardFooter className=" flex-col items-center">
                                <Button onClick={() => router.push("/auth/login")} className=" bg-orange-500 w-full hover:bg-orange-400">Voltar</Button>
                            </CardFooter>
                        </>}
                </Card>
            </main>
        </>
    )
}