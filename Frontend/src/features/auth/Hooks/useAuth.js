import { useDispatch } from "react-redux"
import { login, register, getMe } from "../services/auth.api"
import { setLoading, setUser, setError } from "../auth.slice"


export const useAuth = () => {

    const dispatch = useDispatch()

    const handleLogin = async (email, password) => {
        try {
            dispatch(setLoading(true))
            const data = await login(email, password)
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }



    const handleRegister = async (email, username, password) => {
        try {
            dispatch(setLoading(true))
            const data = await register(email, username, password)
            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }



    const handleGetMe = async () => {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleLogin,
        handleGetMe,
        handleRegister
    }

}
