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

export default function PasswordReset() {


    const form = useForm<z.infer<typeof CredentialsSchemaResetPassword>>({
        resolver: zodResolver(CredentialsSchemaResetPassword),
        defaultValues: {
            email: "",
        }
    })


    async function onSubmit(values: z.infer<typeof CredentialsSchemaResetPassword>,) {

        const { error, success } = await resetPassword(values)
        if (success) {
            alert(success)
        } else {
            alert(error)
        }


    }
    return (
        <>
            <main className="flex min-h-screen flex-col items-center pt-24 justify-between">
                <Card className="w-full max-w-sm">
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
                                <Button disabled={false} className="bg-orange-500 w-full hover:bg-orange-400">Enviar</Button>
                            </CardFooter>
                        </form>
                        <CardFooter className="">
                        </CardFooter>
                    </Form>
                </Card>
            </main>
        </>
    )
}