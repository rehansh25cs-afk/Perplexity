import axios from "axios"



const api = axios.create({
    baseURL: "https://perplexity-1-4jje.onrender.com/api/auth",
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



export const logout = async () => {

    const response = await api.post("/logout")
    return response.data;
    
}



