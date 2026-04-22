import {Server} from 'socket.io';

let io;

export const initSocketServer = (server) => {
    io = new Server(server, {
        cors: { 
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            withCredentials: true
        }
    });

    console.log("Socket io server is running");

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);

    });
}


export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io server not initialized");
    }
    return io;
}





