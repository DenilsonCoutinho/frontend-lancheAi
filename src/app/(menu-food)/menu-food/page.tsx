"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useTransition } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useToast } from "@/components/ui/use-toast";
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
import { createCategory, deleteCategory, editNameCategoryByid } from "../../../../actions/menu-food";
import { getCategories } from "../../../../services/menu-food";
import { updateAllCategoriesPosition } from "../../../../actions/menu-food";
import { LoaderIcon } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import CategoryList from "../../../../components/menu-food/categoryList";
import { useSessionProps } from "../../../../context/dataSessionProvider";
interface listArray {
    id: string
    name: string
    establishmentId: string
}


export default function MenuFood() {
    const { toast } = useToast()
    const [originalArrayCategories, setOriginalArrayCategories] = useState<listArray[]>([])
    const [closeModal, setCloseModal] = useState<boolean>(false)
    const [observer, setObserver] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [createCategories, setCreateCategories] = useState<string>("")
    const [myNewCategoryName, setMyNewCategoryName] = useState<string>("")
    console.log(myNewCategoryName)
    const [isPending, startTransition] = useTransition()
    const { id, setId } = useSessionProps()

    useEffect(() => {
        const handleKeyPress = async (e: any) => {
            if (e.key === "Enter" && observer) {
                startTransition(async () => {

                    const { success, error } = await createCategory(createCategories, id);
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
            const data = await getCategories(id)
            const sortedCategories = data.sort((a: any, b: any) => a?.order - b?.order);
            setOriginalArrayCategories(sortedCategories)
            setLoading(false)
        }
        if (id) {
            getDataCategories()
        }
    }, [id])
    async function filteredListCategories(search: string) {
        const filteredItems = originalArrayCategories.filter((e: listArray) => e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        setOriginalArrayCategories(filteredItems)
    }
    async function revalidateCategories() {
        const data = await getCategories(id)
        const sortedCategories = data.sort((a: any, b: any) => a?.order - b?.order);
        setOriginalArrayCategories(sortedCategories)
    }
    async function editNameCategory(id: string, newName: string) {
        await editNameCategoryByid(id, newName)
        await revalidateCategories()

        alert("atualizou ")
        return
    }

    async function createNewCategory() {
        startTransition(async () => {

            const { success, error } = await createCategory(createCategories, id)
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
    async function deleteSelectedCategory(id: string) {
        startTransition(async () => {
            const { error, success } = await deleteCategory(id)
            if (error) {
                toast({
                    title: error,
                    description: "",
                    className: "bg-red-500 relative text-white",
                    action: <ToastAction altText="ok">Ok</ToastAction>
                })
                return
            }
            await revalidateCategories()
            toast({
                title: success,
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
        const item: listArray[] = remodelList(originalArrayCategories, res.source.index, res.destination.index)
        const resComparation = await compareArray(originalArrayCategories, item)
        if (resComparation) {
            toast({
                title: `Categoria não alterada!`,
                description: "",
                className: "bg-blue-500 relative text-white",
            })
            return
        }
        setOriginalArrayCategories(item)

        const newCategoryOrder = item.map((item, index) => ({
            id: item.id,
            name: item.name,
            order: index // O index é o novo valor de order
        }));
        await updateAllCategoriesPosition(newCategoryOrder)
        toast({
            title: `As ordens das categorias foram alteradas.`,
            description: ""
            ,
            className: "bg-green-500 relative text-white",
            action: <ToastAction altText="ok">Ok</ToastAction>

        })
    }
    if (loading) {
        return <div>
            <div className="bg-bgOrangeDefault  h-6 w-full">
                <p className="text-white max-w-[1200px] m-auto">Lancha AI</p>
            </div>

            <Card className="max-w-[1200px] m-auto mt-4 w-full ">
                <CardHeader>
                    <CardTitle className="text-2xl">Cardápio</CardTitle>
                    <CardDescription>
                        Ajuste seu cardápio abaixo
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="border rounded-md shadow-sm bg-white px-5 py-10 mt-5 max-w-[1200px] m-auto w-full">
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
            <div className="bg-bgOrangeDefault  h-6 w-full">
                <p className="text-white max-w-[1200px] m-auto">Lancha AI</p>
            </div>
            <Card className="max-w-[1200px] m-auto mt-4 w-full ">
                <CardHeader>
                    <CardTitle className="text-2xl">Cardápio</CardTitle>
                    <CardDescription>
                        Ajuste seu cardápio abaixo
                    </CardDescription>
                </CardHeader>
            </Card>

            {!loading && <div className="border rounded-md shadow-sm bg-white px-5 py-10 mt-5 max-w-[1200px] m-auto  w-full">
                <Card className="w-full pt-5 px-3">
                    <CardContent className="flex items-center justify-between">
                        <Input onChange={(e) => filteredListCategories(e.target.value)} type="text" placeholder="Pesquisar" className="max-w-xs" />
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

                {originalArrayCategories?.length > 0 ? <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="categories" type="list" direction="vertical" >
                        {(provided) => (
                            <article className="" ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    originalArrayCategories?.map((categories: listArray, index: any) => {
                                        return <CategoryList newNameCategory={(e) => setMyNewCategoryName(e)} onClickEdit={() => editNameCategory(categories.id, myNewCategoryName)} onClickDelete={() => deleteSelectedCategory(categories.id)} key={categories?.id} categories={categories} index={index} />
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
