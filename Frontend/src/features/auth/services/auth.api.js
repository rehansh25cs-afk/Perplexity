import axios from "axios"



const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})


export const login = async (email, password) => {
    const response = await api.post("/login", { email, password })
    return response.data
}



export const register = async (email, username, password) => {
    const response = await api.post("/register", { email, username, password })
    return response.data
}



export const getMe = async () => {
    const response = await api.get("/get-me")
    return response.data
}



