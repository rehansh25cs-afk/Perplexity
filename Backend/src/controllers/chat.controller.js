import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import { generateResponse, generateChatTitle } from "../services/chat.service.js"

export const messageController = async (req, res) => {

    const { message, chat: chatId } = req.body
    

    let chat = null, title = null;

    if (!chatId) {
        title = await generateChatTitle(message)
        chat = await chatModel.create({ title, user: req.user.id })
    }

    const newMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user"
    })

    const messages = await messageModel.find({ chat: chatId || chat._id })

    const aiResponse = await generateResponse(messages)

    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: aiResponse,
        role: "ai"
    })



    return res.status(200).json({
        message: "Response generated successfully",
        chat,
        title,
        aiMessage
    })

}



export const getChatsController = async(req,res)=>{

    const userId = req.user.id

    const chats = await chatModel.find({user: userId})

    if(!chats) {
        return res.status(404).json({
            message: "No chats found for the user"
        })
    }

    return res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
    
}



export const getMessagesController = async(req,res)=>{

    const {chatId} = req.params

    const chat = await chatModel.findById(chatId)

    if(!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({chat: chatId})

    return res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
    
}




export const deleteChatController = async(req,res)=>{

    const {chatId} = req.params

    const chat = await chatModel.findById(chatId)

    if(!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({chat: chatId})

    return res.status(200).json({
        message: "Chat deleted successfully",
    })
    
}
