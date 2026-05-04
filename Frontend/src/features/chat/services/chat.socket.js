import { io } from 'socket.io-client';

export const initSocketConnection = () => {
    const socket = io('https://perplexity-1-4jje.onrender.com',{
        credentials: true,
    })

    socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
    });



};


