import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './socket-auth';

// Use the Server type from socket.io
let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  //  auth middleware active
  io.use(socketAuth());

  io.on('connection', (socket: any) => {
    console.log('Socket connected:', socket.user?.user_id);

    // just for testing
    socket.on('chat message', (msg: any) => {
      console.log('message: ' + msg);
    });

    // Welcome message on connection
    socket.emit('chat message', 'Welcome to the chat!');

    // 1. Join personal room
    socket.join(socket.user.user_id);

    // 2. If Admin, join the global support room
    if (socket.user.role === 'ADMIN' || socket.user.role === 'SUPER_ADMIN') {
      socket.join('admin_support_room');
      console.log(`Admin ${socket.user.user_id} is ready for support.`);
    }

    // 3. Handle joining specific chat rooms
    socket.on('join_chat', (chatId: string) => {
      socket.join(chatId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.user?.user_id);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};
