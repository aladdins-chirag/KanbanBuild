import { Route, Routes } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Header from "./components/Header"
import RefreshRoute from "./components/RefreshRoute"
import NotificationProvider from "./components/context/NotificationContext"

function App() {
    return (
        <NotificationProvider>
            <RefreshRoute />
            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </NotificationProvider>
    )
}

export default App