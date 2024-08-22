"use client"
import { Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaPen, FaPlusCircle, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface categoriesProps {
    categories: {
        id: string;
        name: string;
    }
    index: number;
    onClickDelete?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onClickEdit?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    newNameCategory: (newName: string) => void
}
export default function CategoryList({ categories, index, onClickDelete, onClickEdit, newNameCategory }: categoriesProps,) {
    const [boxCategoryEdit, setBoxCategoryEdit] = useState<boolean>(false)
    const [nameCategory, setNameCategory] = useState<string>("")
    // console.log(nameCategory)
    const route = useRouter()
    return (

        <Draggable draggableId={categories.id} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex justify-between items-center flex-row gap-4 rounded-lg px-3 bg-gray-100 py-8 my-4">
                    <div className="flex flex-col gap-4 rounded-lg px-3 bg-gray-100 ">
                        <div className="flex items-center gap-3">
                            <FaGripVertical className="text-2xl text-gray-400" />
                            {boxCategoryEdit ?
                                <div className="flex flex-col gap-4">
                                    <Input className="h-6" onChange={(e) => { setNameCategory(e.target.value); newNameCategory(e.target.value) }} value={nameCategory} />
                                    <div className="flex flex-row gap-3">
                                        <Button onClick={onClickEdit} className="h-6 bg-green-600">Salvar</Button>
                                        <Button onClick={() => setBoxCategoryEdit(false)} className="h-6 bg-red-600">cancelar</Button>
                                    </div>
                                </div>
                                :
                                <p className="text-gray-700 text-2xl font-bold">{categories.name}</p>
                            }
                        </div>
                        <div onClick={() => route.push(`/createItem?id=${categories?.id}`)} id="add-category" className="flex items-center cursor-pointer gap-1 bg-bgOrangeDefault w-44 justify-center rounded-md p-1">
                            <FaPlusCircle className="text-xl text-white" />
                            <p className="text-black text-sm">Adicionar item</p>
                        </div>
                    </div>
                    <Menubar >
                        <MenubarMenu>
                            <MenubarTrigger>Ações categoria</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={onClickDelete}>
                                    Excluir categoria <MenubarShortcut><FaTrash className="text-gray-500" /></MenubarShortcut>
                                </MenubarItem>
                                {/* <MenubarSeparator /> */}
                                <MenubarItem onClick={() => { setBoxCategoryEdit(true); setNameCategory(categories.name), newNameCategory(categories.name) }}>Editar categoria <MenubarShortcut><FaPen className="text-gray-500" /></MenubarShortcut></MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>

                </div>
            )
            }
        </Draggable >


    )
}