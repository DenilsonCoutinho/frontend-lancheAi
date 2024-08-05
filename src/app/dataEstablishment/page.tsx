"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import app from "@/lib/firebase/firebase";
import { createDataEstablishment } from "../../../actions/dataEstablishment";
import { useToast } from "@/components/ui/use-toast";
import { getSession } from "next-auth/react";
import { maskPhone } from "@/utils/maskPhone";
import { z } from "zod";
import { DataEstablishmentSchema } from "../../../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
export default function DataEstablishment() {
    const [isPending, startTransition] = useTransition()
    const [imgDonwLoader, setImgDonwLoader] = useState<any>()
    const [contact, setContact] = useState<string>("")
    const [name, setName] = useState<string>("")
    const { toast } = useToast()

    type responseUpload = {
        errorImg?: string | undefined
        successImg?: string | undefined
        imgUpload?: string | undefined
    }

    const form = useForm<z.infer<typeof DataEstablishmentSchema>>({
        resolver: zodResolver(DataEstablishmentSchema),
        values: {
            contact: contact,
            name: name,
        },
        defaultValues: {
            name: "",
            contact: ""
        }
    })


    async function onSubmit(values: z.infer<typeof DataEstablishmentSchema>) {
        const dataSession = await getSession()
        if (!dataSession) {
            return toast({
                title: "Não Autorizado!",
                description: "erro 401 ",
                className: "bg-red-500 relative text-white",

            })
        }
        const credentialValidate = DataEstablishmentSchema.safeParse(values);
        if (!credentialValidate?.success) {
            return toast({
                title: "Dados inválidos",
                description: " Campo vazío ou credenciais inválidas!",
                className: "bg-red-500 relative text-white",

            })

        }
        const id = dataSession?.user?.id as string
        const { imgUpload } = await handleUpload()
        const dataEstablishment = {
            name: name,
            contact: contact.replace(/\D/g, '')
            
        }
        const { error, success } = await createDataEstablishment(dataEstablishment, id, imgUpload)
        if (success) {
            return toast({
                title: success,
                description: ":)",
                className: "bg-green-500 relative text-white",

            })
        }

        toast({
            title: error,
            description: ":(",
            className: "bg-red-500 relative text-white",

        })
    }


    async function handleUpload(): Promise<responseUpload> {
        if (imgDonwLoader !== undefined) {
        console.log( imgDonwLoader[0])

            const storage = getStorage(app)
            const storageRef = ref(storage, "images/" + imgDonwLoader[0]?.name)
            await uploadBytes(storageRef, imgDonwLoader[0])
            const downLoadURL = await getDownloadURL(storageRef)

            return {
                successImg: "imagem carregada!",
                imgUpload: downLoadURL
            }
        }
        return { errorImg: "Sem imagem carregada!" }
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
                        <Form {...form} >
                            <form className="mt-5 pr-10" onSubmit={form.handleSubmit(onSubmit)} >
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do estabelecimento *</FormLabel>
                                                <FormControl>
                                                    <Input

                                                        id="name-establishment"
                                                        type="text"
                                                        placeholder="Nome do estabelecimento"
                                                        disabled={isPending}
                                                        required
                                                        {...field}
                                                        onChange={(e) => setName(e.target.value)}
                                                        value={name}
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
                                                <FormLabel>Contato *</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            id="contact-establishment"
                                                            type='text'
                                                            placeholder="Contato"
                                                            required
                                                            maxLength={14}
                                                            {...field}
                                                            onChange={(e) => setContact(maskPhone(e.target.value))}
                                                            value={contact}
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button id="button-save-establishment" color="" className="bg-bgOrangeDefault hover:bg-orange-400 max-w-xs">Salvar</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <div className="w-80 h-80 rounded-2xl text-center flex justify-center items-center bg-bgOrangeDefault">
                        <Input id="input-logo" type="file" onChange={(e) => setImgDonwLoader(e.target.files)} />
                    </div>
                </div>
            </div>
        </div>
    )
}