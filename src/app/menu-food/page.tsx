"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useTransition } from "react";
import AboutProducts from "../../../components/menu-food/aboutProducts";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useToast } from "@/components/ui/use-toast";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { getSession } from "next-auth/react";
import createCategory from "../../../actions/menu-food";
import { getCategories, updateAllCategoriesPosition } from "../../../services/menu-food";
import { LoaderIcon } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
interface listArray {
    id: string
    name: string
    establishmentId: string
}

export default function MenuFood() {
    const { toast } = useToast()
    const [categories, setCategories] = useState<any>(undefined)
    const [closeModal, setCloseModal] = useState<boolean>(false)
    const [observer, setObserver] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [createCategories, setCreateCategories] = useState<string>("")
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const handleKeyPress = async (e: any) => {
            if (e.key === "Enter" && observer) {
                startTransition(async () => {
                    const dataSession = await getSession();
                    const idSession = dataSession?.user?.id as string;
                    const { success, error } = await createCategory(createCategories, idSession);
                    await revalidateCategories();
                    setCloseModal(false);
                    if (success) {
                        toast({
                            title: success,
                            description: "",
                            className: "bg-green-500 relative text-white",
                        });
                    } else {
                        toast({
                            title: error,
                            description: "",
                            className: "bg-green-500 relative text-white",
                        });
                    }
                });
                setObserver(false);
            }
        };

        if (observer) {
            window.addEventListener("keypress", handleKeyPress);
        }

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, [observer, createCategories]);

    useEffect(() => {
        async function getDataCategories() {
            const dataSession = await getSession()
            const idSession = dataSession?.user?.id as string
            const data = await getCategories(idSession)
            setCategories(data)
            setLoading(false)
        }
        getDataCategories()
    }, [])

    async function revalidateCategories() {
        const dataSession = await getSession()
        const idSession = dataSession?.user?.id as string
        const data = await getCategories(idSession)
        setCategories(data)
    }

    async function createNewCategory() {
        startTransition(async () => {
            const dataSession = await getSession()
            const idSession = dataSession?.user?.id as string
            const { success, error } = await createCategory(createCategories, idSession)
            await revalidateCategories()
            setCloseModal(false)
            if (success) {
                toast({
                    title: success,
                    description: "",
                    className: "bg-green-500 relative text-white",
                    action: <ToastAction altText="ok">Ok</ToastAction>
                })
                return
            }
            toast({
                title: error,
                description: "",
                className: "bg-green-500 relative text-white",
                action: <ToastAction altText="ok">Ok</ToastAction>
            })
        })
    }

    function remodelList<T>(list: T[], startIndex: number, endIndex: number) {
        //"Array.from" cria uma nova instância do meu array para garantir a imutabilidade dele.
        const res = Array.from(list)
        const [removed] = res.splice(startIndex, 1)
        res.splice(endIndex, 0, removed)
        return res
    }

    async function compareArray(originalArray: listArray[], newArray: listArray[]) {
        if (originalArray.length !== newArray.length) return false;
        return originalArray.every((element, index) => element === newArray[index]);
    }

    async function onDragEnd(res: any) {
        if (!res.destination) return;
        const dataSession = await getSession()
        const idSession = dataSession?.user?.id as string
        const item: listArray[] = remodelList(categories, res.source.index, res.destination.index)
        const resComparation = await compareArray(categories, item)
        if (resComparation) {
            toast({
                title: `Categoria não alterada!`,
                description: "",
                className: "bg-blue-500 relative text-white",
            })
            return
        }
        //setCategories serve para formatar o array para o cliente quando ele alterar.
        setCategories(item)
        await updateAllCategoriesPosition(idSession, categories)
        toast({
            title: `As ordens das categorias foram alteradas.`,
            description: <FaRegCheckCircle />
            ,
            className: "bg-green-500 relative text-white",
            action: <ToastAction  altText="ok">Ok</ToastAction>

        })
    }
    if (loading) {
        return <div>
            <Card className="w-full ">
                <CardHeader>
                    <CardTitle className="text-2xl">Cardápio</CardTitle>
                    <CardDescription>
                        Ajuste seu cardápio abaixo
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="border rounded-md shadow-sm bg-white px-5 py-10 mt-5 w-full">
                <Card className="w-full pt-5 px-3">
                    <CardContent className="flex items-center justify-between">
                        <Skeleton className="w-[200px] h-10 rounded-md" />
                        <Sheet open={closeModal} onOpenChange={setCloseModal}>
                            <Skeleton className="max-w-[200px] w-full h-10 rounded-md" />
                        </Sheet>
                    </CardContent>
                </Card>

                {<div className="flex flex-col justify-between gap-2">
                    <Skeleton className="w-full h-20 mt-4 rounded-md" />
                    <Skeleton className="w-full h-20 mt-4 rounded-md" />
                    <Skeleton className="w-full h-20 mt-4 rounded-md" />
                    <Skeleton className="w-full h-20 mt-4 rounded-md" />
                </div>
                }
            </div>
        </div>
    }

    return (
        <div>
            <Card className="w-full ">
                <CardHeader>
                    <CardTitle className="text-2xl">Cardápio</CardTitle>
                    <CardDescription>
                        Ajuste seu cardápio abaixo
                    </CardDescription>
                </CardHeader>
            </Card>

            {!loading && <div className="border rounded-md shadow-sm bg-white px-5 py-10 mt-5 w-full">
                <Card className="w-full pt-5 px-3">
                    <CardContent className="flex items-center justify-between">
                        <Input type="text" placeholder="Pesquisar" className="max-w-xs" />
                        <Sheet open={closeModal} onOpenChange={setCloseModal}>
                            <SheetTrigger onClick={() => setObserver(!observer)} className="bg-orange-500 text-white   h-10 px-4 py-2 sm:h-9 sm:rounded-md sm:px-3 lg:h-11 lg:rounded-md lg:px-8">
                                + Criar categoria
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>
                                        Criar categoria
                                    </SheetTitle>
                                    <Input onChange={(e) => setCreateCategories(e.target.value)} type="text" placeholder="Ex..: bebida, X-tudo" id="input-category-create" />
                                    <Button disabled={isPending} onClick={() => { createNewCategory() }} id="button-category-create" color="" className="bg-bgOrangeDefault hover:bg-orange-400 ">
                                        {!isPending ? "Criar" : "Criando"}
                                        <LoaderIcon className={!isPending ? "hidden" : "animate-spin mr-2"} />

                                    </Button>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </CardContent>
                </Card>

                {categories?.length > 0 ? <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="categories" type="list" direction="vertical" >
                        {(provided) => (
                            <article className="" ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    categories &&
                                    categories?.map((task: any, index: any) => {
                                        return <AboutProducts key={task?.id} categories={task} index={index} />
                                    })
                                }
                                {provided.placeholder}
                            </article>
                        )}
                    </Droppable>

                </DragDropContext>
                    :
                    <div className="flex items-center justify-center  py-4 my-4">
                        <h1 className="text-3xl text-gray-400">Não há categorias aqui!</h1>
                    </div>
                }
            </div>}
        </div>
    )

}