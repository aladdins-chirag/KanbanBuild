import { createContext, useMemo } from "react"


export const DragCard = createContext()
const DragCardInfoProvider = ({ children }) => {
    const value = useMemo(() => ({
        draggedCardId: '',
    }), [])
    return (
        <DragCard.Provider value={value}>
            {children}
        </DragCard.Provider>
    )
}

export default DragCardInfoProvider