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
import { useTransition } from "react"
import { signIn } from "../../../../auth"
import { login } from "../../../../actions/auth/login"
export default function Login() {
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof CredentialsSchema>>({
        resolver: zodResolver(CredentialsSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof CredentialsSchema>) {
        const resp = await login(values);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
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

                        <CardFooter>
                            <Button disabled={false} className="w-full">Entrar</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </main>

    )
}
