"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useTransition } from "react";
import AboutProducts from "../../../components/menu-food/aboutProducts";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useToast } from "@/components/ui/use-toast";
import { FaRegCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { LoaderIcon } from "lucide-react";


export default function MenuFood() {
    const { toast } = useToast()

    const [categories, setCategories] = useState<any>(undefined)
    const [closeModal, setCloseModal] = useState<boolean>(false)
    const [createCategories, setCreateCategories] = useState<string>("")
    const [refresh, setRefresh] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()


    useEffect(() => {

        async function getDataCategories() {
            const dataSession = await getSession()
            const idSession = dataSession?.user?.id as string
            const response = await fetch(`/api/menu-food?establishmentId=${idSession}`, {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            const data = await response.json()
            setCategories(data)
        }
        getDataCategories()
    }, [])

    async function revalidateCategories() {
        const dataSession = await getSession()
        const idSession = dataSession?.user?.id as string
        const response = await fetch(`/api/menu-food?establishmentId=${idSession}`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        const data = await response.json()
        setCategories(data)
    }

    async function createNewCategory() {
        startTransition(async () => {

            const dataSession = await getSession()
            const idSession = dataSession?.user?.id as string
            const { success, error } = await createCategory(createCategories, idSession)
            await revalidateCategories()
            setCloseModal(false)
            console.log(success, error)
        })
    }

    async function onDragEnd(res: any) {
        if (!res.destination) return;
        const dataSession = await getSession()
        const idSession = dataSession?.user?.id as string
        const item = remodelList(categories, res.source.index, res.destination.index)
        setCategories(item)
        const newData = await updateAllCategoriesPosition(idSession, item)
        console.log(newData)
        toast({
            title: `As ordens das categorias foram alteradas.`,
            description: <FaRegCheckCircle />
            ,
            className: "bg-green-500 relative text-white",

        })
    }

    function remodelList<T>(list: T[], startIndex: number, endIndex: number) {
        //"Array.from" cria uma nova instância do meu array para garantir a imutabilidade dele.
        const res = Array.from(list)
        const [removed] = res.splice(startIndex, 1)
        res.splice(endIndex, 0, removed)
        return res
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
            <div className="border rounded-md shadow-sm bg-white px-5 py-10 mt-5 w-full">
                <Card className="w-full pt-5 px-3">
                    <CardContent className="flex items-center justify-between">
                        <Input type="text" placeholder="Pesquisar" className="max-w-xs" />
                        <Sheet open={closeModal} onOpenChange={setCloseModal}>
                            <SheetTrigger className="bg-orange-500 text-white   h-10 px-4 py-2 sm:h-9 sm:rounded-md sm:px-3 lg:h-11 lg:rounded-md lg:px-8">
                                + Criar categoria
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>
                                        Criar categoria
                                    </SheetTitle>
                                    <Input onChange={(e) => setCreateCategories(e.target.value)} type="text" placeholder="Ex..: bebida, X-tudo" id="input-category-create" />
                                    <Button disabled={isPending} onClick={() => { createNewCategory(); setRefresh(!refresh) }} id="button-category-create" color="" className="bg-bgOrangeDefault hover:bg-orange-400 ">
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
            </div>
        </div>
    )

}