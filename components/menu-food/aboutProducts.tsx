import { Draggable } from "@hello-pangea/dnd";
import { FaGripVertical } from "react-icons/fa";

interface categoriesProps {
    categories: {
        id: string;
        name: string;
    }
    index: number;
}

export default function AboutProducts({ categories, index }: categoriesProps) {
    return (
        <Draggable draggableId={categories.id} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex gap-4 rounded-lg items-center bg-gray-100 py-4 my-4">
                    <FaGripVertical className="text-2xl text-gray-400" />
                    <p className="text-black">{categories.name}</p>
                </div>
            )}
        </Draggable>

    )
}