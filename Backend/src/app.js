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
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.static(path.resolve('./public')))

app.use("/api/auth", authRouter)

app.use("/api/chats", chatRouter)


// serve frontend index for any unknown route (single-page app)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app