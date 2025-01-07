import { createContext, useState } from "react"

export const NotificationContext = createContext()

const NotificationProvider = ({ children }) => {
    let [notifications, setNotifications] = useState([])
    let [isFetchNotification, setIsFetchNotification] = useState(false)

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, isFetchNotification, setIsFetchNotification }}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider