import { createContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosFetch } from "../../Utils/Fetch";
import toast from "react-hot-toast";

export const AuthContext = createContext()

const AuthenticateUser = ({ children }) => {
    const navigate = useNavigate()
    const value = useMemo(() => (
        {
            handleLogOut: async () => {
                try {
                    const { data } = await AxiosFetch.get('/auth/logout')
                    toast.success(data?.message)
                    localStorage.removeItem('userID')
                    navigate('/')
                } catch (error) {
                    console.log(error)
                }
            }
        }
    ), [])

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export default AuthenticateUser