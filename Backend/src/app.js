import express from "express"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import chatRouter from "./routes/chat.routes.js"
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://perplexity-1.4jje.onrender.com",
    credentials: true
}))

app.use(express.static("./public"))

app.use("/api/auth", authRouter)

app.use("/api/chats", chatRouter)

app.use("*name", (req, res)=>{
    res.sendFile("./public/index.html")
})


export default app