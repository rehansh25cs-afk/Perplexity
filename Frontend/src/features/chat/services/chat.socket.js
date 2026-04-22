import { io } from 'socket.io-client';

export const initSocketConnection = () => {
    const socket = io('http://localhost:3000',{
        credentials: true,
    })

    socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
    });



};


