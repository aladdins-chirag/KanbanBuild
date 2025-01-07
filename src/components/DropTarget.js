import { useDrop } from "react-dnd"
import { ItemType } from "../Utils/ItemTypes"
import { useContext } from "react"
import { DragCard } from "./context/DragCardContext"
import { TaskContext } from "./Column"




function DropTarget({ children, status }) {
    const card = useContext(DragCard)
    const markDown = useContext(TaskContext)
    const [{ isOver }, drop] = useDrop({
        accept: ItemType.CARD,
        drop: (item, _) => {
            markDown(item.cardId, status)
            card.draggedCardId = item.cardId
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    })
    return (
        <div ref={drop} className="mt-4" style={{ backgroundColor: isOver ? 'rgba(128, 128, 128, 0.1)' : 'transparent', width: '80%', minHeight: '5em', margin: 'auto' }}>
            {children}
        </div>
    )
}

export default DropTarget