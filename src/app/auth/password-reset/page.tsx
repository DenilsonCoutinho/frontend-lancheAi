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
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function PasswordResetChange() {

    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState<boolean | undefined>(false);

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        }
    })
    const searchParams = useSearchParams();
    const router = useRouter()
    const { toast } = useToast()

    if (!searchParams || !searchParams.has("token")) return null;
    const token = searchParams.get("token");

    async function onSubmit(values: z.infer<typeof NewPasswordSchema>,) {

        const validatedPassword = NewPasswordSchema.safeParse(values);

        if (!validatedPassword.success) {
            return { error: "Dados inválidos" };
        }

        startTransition(async () => {
            setLoading(false)

            await new Promise(resolve => setTimeout(resolve, 3000))

            try {
                const { success, error } = await changePassword(values, token);
                if (error){
                     toast({
                        title: error,
                        description: ":(",
                        action: <ToastAction altText="tente novamente">ok</ToastAction>,
                        className: "bg-red-500 relative text-white",
    
                    })
                    return
                };
                toast({
                    title: success,
                    description: ":)",
                    action: <ToastAction altText="tente novamente">ok</ToastAction>,
                    className: "bg-green-500 relative text-white",

                })
                form.reset();
            } catch (err) {
                toast({
                    title: "Algo deu errado.",
                    description: ":(",
                    action: <ToastAction altText="tente novamente">ok</ToastAction>,
                    className: "bg-red-500 relative text-white",

                })
                form.reset();
            }
            setLoading(true)
        })


    }
    
    return (
        <>
            <main className="flex min-h-screen flex-col items-center pt-24 justify-between">
                <Card className="w-full max-w-sm">
                    {!loading ? <CardHeader>
                        <CardTitle className="text-2xl">Insira sua senha nova</CardTitle>
                    </CardHeader>
                        :
                        <CardHeader>
                            <CardTitle className="text-2xl">Senha alterada com sucesso!</CardTitle>
                        </CardHeader>
                    }

                    {!loading ? <Form
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
                                <Button disabled={false} className="bg-orange-500 w-full hover:bg-orange-400">
                                    <LoaderIcon className={!isPending ? "hidden" : "animate-spin mr-2"} />
                                    Alterar
                                </Button>
                            </CardFooter>
                        </form>
                        <CardFooter className="">
                        </CardFooter>
                    </Form>
                        :
                        <CardFooter className=" flex-col items-center">

                            <Button onClick={() => router.push("/auth/login")} disabled={false} className="bg-orange-500 w-full hover:bg-orange-400">
                                <LoaderIcon className={!isPending ? "hidden" : "animate-spin mr-2"} />
                                Voltar</Button>
                        </CardFooter>
                    }
                </Card>

            </main>
        </>
    )
}