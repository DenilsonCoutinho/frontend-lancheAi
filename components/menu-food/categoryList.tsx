import { Draggable } from "@hello-pangea/dnd";
import { FaGripVertical, FaPlusCircle, FaTrash } from "react-icons/fa";
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
interface categoriesProps {
    categories: {
        id: string;
        name: string;
    }
    index: number;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default function CategoryList({ categories, index, onClick }: categoriesProps,) {
    const route = useRouter()
    return (

        <Draggable draggableId={categories.id} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex justify-between items-center flex-row gap-4 rounded-lg px-3 bg-gray-100 py-8 my-4">
                    <div className="flex flex-col gap-4 rounded-lg px-3 bg-gray-100 ">
                        <div className="flex items-center gap-3">
                            <FaGripVertical className="text-2xl text-gray-400" />
                            <p className="text-gray-700 text-2xl font-bold">{categories.name}</p>
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
                                <MenubarItem onClick={onClick}>
                                    Excluir categoria <MenubarShortcut><FaTrash className="text-gray-500" /></MenubarShortcut>
                                </MenubarItem>
                                {/* <MenubarSeparator /> */}
                                {/* <MenubarItem>New Window</MenubarItem> */}
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>

                </div>
            )
            }
        </Draggable >


    )
}