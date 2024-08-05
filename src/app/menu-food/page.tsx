"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import AboutProducts from "../../../components/menu-food/aboutProducts";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
export default function MenuFood() {

    const [categories, setCategories] = useState([
        // {
        //     id: "0",
        //     name: "Estudar react com typescript"
        // },
        // {
        //     id: "1",
        //     name: "Inscrever no canal do Sujeito Programador"
        // },
        // {
        //     id: "2",
        //     name: "Pagar o aluguel"
        // },
    ])
    console.log(categories.length)

    function onDragEnd(res: any) {
        if (!res.destination) return;

        const item = remodelList(categories, res.source.index, res.destination.index)
        setCategories(item)
    }

    function remodelList<T>(list: T[], startIndex: number, endIndex: number) {
        //"Array.from" cria uma nova instância do meu array para garantir a imutabilidade dele.
        const res = Array.from(list)
        const [removed] = res.splice(startIndex, 1)
        res.splice(endIndex, 0, removed)
        console.log(res)
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
            <div className="border rounded-md shadow-sm bg-white py-10 mt-5 w-full">
                {categories.length > 0 ? <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="categories" type="list" direction="vertical" >
                        {(provided) => (
                            <article className="" ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    categories?.map((task, index) => {
                                        console.log(categories)
                                        return <AboutProducts key={index} categories={task} index={index} />
                                    })
                                }
                                {provided.placeholder}
                            </article>
                        )}
                    </Droppable>

                </DragDropContext>
                    :
                    <div className="flex items-center justify-center bg-gray-200 py-4 my-4">
                        <h1 className="text-3xl text-gray-400">Não há categorias aqui!</h1>
                    </div>
                }
            </div>
        </div>
    )

}