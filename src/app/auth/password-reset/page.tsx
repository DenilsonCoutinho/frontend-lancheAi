"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { NewPasswordSchema } from "../../../../schemas/auth";
import { z } from "zod";
import { changePassword, resetPassword } from "../../../../actions/auth/password-reset-request";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PasswordResetChange() {
    const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        }
    })
    const searchParams = useSearchParams();
	if (!searchParams || !searchParams.has("token")) return null;
	const token = searchParams.get("token");

    async function onSubmit(values: z.infer<typeof NewPasswordSchema>,) {
        const validatedPassword = NewPasswordSchema.safeParse(values);

        if (!validatedPassword.success) {
            return { error: "Dados inválidos" };
        }
        try {
            const { success, error } = await changePassword(values, token);
            if (error) setError(error);
            setSuccess(success || "");
            form.reset();
        } catch (err) {
            setSuccess("");
            setError("Algo deu errado.");
            form.reset();
        }


    }
    return (
        <>
            <main className="flex min-h-screen flex-col items-center pt-24 justify-between">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Insira sua senha nova</CardTitle>
                        <CardDescription>
                    
                        </CardDescription>
                    </CardHeader>

                    <Form
                        {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            <CardContent className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Senha nova</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="insira sua senha nova"
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
                                <Button disabled={false} className="bg-orange-500 w-full hover:bg-orange-400">Alterar</Button>
                            </CardFooter>
                        </form>
                        <CardFooter className="">
                        </CardFooter>
                    </Form>
                </Card>
                {success}
                {error}
            </main>
        </>
    )
}