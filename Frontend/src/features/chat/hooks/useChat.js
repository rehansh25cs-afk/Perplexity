import { initSocketConnection } from "../services/chat.socket";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setChat, setLoading } from "../chat.slice";
import { sendMessage, getMessages, getChats, deleteChat } from "../services/chat.api"
import { addNewMessage, addMessages, createNewChat, setCurrentChatId } from "../chat.slice";
import { logout } from "../../auth/services/auth.api";

export const useChat = () => {

    const dispatch = useDispatch();

    const handleSendMessage = useCallback(async (message, chatId) => {

        if (!message?.trim()) return;

        dispatch(setLoading(true))

        const data = await sendMessage(message, chatId)
        const { aiMessage, chat } = data;
        const resolvedChatId = chat?._id || chatId;

        if (!resolvedChatId) {
            dispatch(setLoading(false))
            return;
        }

        if (!chatId) {
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))
        }

        dispatch(addNewMessage({
            chatId: resolvedChatId,
            content: message,
            role: "user"
        }))

        dispatch(addNewMessage({
            chatId: resolvedChatId,
            content: aiMessage.content,
            role: "assistant"
        }))

        dispatch(setCurrentChatId(resolvedChatId))

        dispatch(setLoading(false))

    }, [dispatch])


    const handleGetChats = useCallback(async () => {

        dispatch(setLoading(true))

        const response = await getChats();
        const chats = Array.isArray(response?.chats) ? response.chats : [];

        dispatch(setChat(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt
            };
            return acc;
        }, {})))

        dispatch(setLoading(false))

    }, [dispatch])


    const handleGetMessages = useCallback(async (chatId, chats) => {

        if (!chatId || !chats?.[chatId]) {
            return;
        }

        if (chats[chatId]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))

    }, [dispatch])



    const handleLogout = useCallback(async() => {
        dispatch(setLoading(true))

        await logout();

        dispatch(setChat({}))
        dispatch(setCurrentChatId(null))
        dispatch(setLoading(false))
        
    }, [dispatch])



    const handleDeleteChat = useCallback(async(chatId) =>{

        dispatch(setLoading(true))
        if (!chatId) return;

        await deleteChat(chatId);

        dispatch(setChat(prev => {
            const updatedChats = { ...prev };
            delete updatedChats[chatId];
            return updatedChats;
        }))

        dispatch(setCurrentChatId(null))

        dispatch(setLoading(false))

    }, [dispatch])



    return {
        initSocketConnection,
        handleGetChats,
        handleSendMessage,
        handleGetMessages,
        handleDeleteChat,
        handleLogout
    }
}