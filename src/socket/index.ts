import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './socket-auth';

// Use the Server type from socket.io
let io: Server;

export const initSocket = (server: HttpServer) => {
  // FIX: Assign to the global 'io' variable, DO NOT use 'const' or 'let' here
  io = new Server(server, {
    cors: { origin: '*' },
  });

  // Note: If you use socket.user.user_id, you MUST have your auth middleware active
  io.use(socketAuth());

  io.on('connection', (socket: any) => {
    // Added optional chaining (?.) to prevent crashes if user is not defined
    console.log('Socket connected:', socket.user?.user_id);

    
    socket.on('chat message', (msg: any) => {
      console.log('message: ' + msg);
    });

    socket.emit('chat message', "Welcome to the chat!");

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.user?.user_id);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};
