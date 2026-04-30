import {Router} from "express"
import { identifyUser } from "../middlewares/auth.middleware.js"
import { deleteChatController, getChatsController, getMessagesController, messageController } from "../controllers/chat.controller.js"
const chatRouter = Router()


chatRouter.post("/message", identifyUser, messageController)

chatRouter.get("/get-chats", identifyUser, getChatsController)

chatRouter.get("/:chatId/get-messages", identifyUser, getMessagesController)

chatRouter.delete("/:chatId", identifyUser, deleteChatController)


export default chatRouter