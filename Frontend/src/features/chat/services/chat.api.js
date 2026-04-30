import axios from "axios";

const api = axios.create({
    baseURL: "https://perplexity-1-4jje.onrender.com/api/chats",
    withCredentials: true,
})

export const sendMessage = async (message, chatId) => {

    const response = await api.post("/message", { message, chat: chatId })
    return response.data;

}

export const getMessages = async (chatId) => {

    const response = await api.get(`/${chatId}/get-messages`)
    return response.data;

}


export const getChats = async()=>{
    const response = await api.get("/get-chats")
    return response.data;
}


export const deleteChat = async(chatId) =>{

    const response = await api.delete(`/${chatId}`)
    return response.data;
    
}




