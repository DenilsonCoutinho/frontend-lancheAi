"use client"
import { CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import { CredentialsSchema, DataEstablishmentSchema } from "../../../schemas/auth";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function DataEstablishment() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof DataEstablishmentSchema>>({
        resolver: zodResolver(DataEstablishmentSchema),
        defaultValues: {
            name: "",
            contact: ""
        }
    })

    async function onSubmit(values: z.infer<typeof DataEstablishmentSchema>) {

    }
    return (
        <div className="">
            <div className="bg-bgOrangeDefault  h-6 w-full">
                <p className="text-white max-w-[1200px] m-auto">Lancha AI</p>
            </div>
            <div className="max-w-[1200px] m-auto">
                <h1 className="text-black text-2xl mt-10">Dados do seu ministério</h1>
                <div className="flex flex-row items-center mt-4">
                    <p className="text-gray-300 text-lg 2xl:w-[20%] lg:w-[27%]">Informações básicas</p>
                    <div className="border-t border-gray-300  w-full"></div>
                </div>
                <div className="flex w-full">
                    <div className="flex flex-col w-full">
                        <Form  {...form}>
                            <form className="mt-5 pr-10" onSubmit={form.handleSubmit(onSubmit)} >
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do estabelecimento*</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Nome do estabelecimento"
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
                                        name="contact"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contato*</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type='text'
                                                            placeholder="Contato"
                                                            required
                                                            {...field}
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button color="" className="bg-bgOrangeDefault hover:bg-orange-400 max-w-xs">Salvar</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <div className="w-80 h-80 rounded-2xl text-center  bg-bgOrangeDefault">
                        BLOCO
                    </div>
                </div>
            </div>
        </div>
    )
}