import "dotenv/config"
import app from "./src/app.js"
import connectToDB from "./src/Config/database.js";
import http from "http"
import { initSocketServer } from "./src/socket/server.socket.js";

const httpServer = http.createServer(app);

initSocketServer(httpServer);







connectToDB()


httpServer.listen(3000, ()=>{
    console.log("Server is running at port 3000");
}) 