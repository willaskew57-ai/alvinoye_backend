import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './socket-auth';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.use(socketAuth());

  io.on('connection', (socket: any) => {
    console.log('Socket connected:', socket.user);

    socket.on('chat message', (msg: any) => {
      console.log('message: ' + msg);
    });

    socket.emit('chat message', 'Welcome to the chat!');

    socket.join(socket.user.user_id);

    if (socket.user.role === 'ADMIN' || socket.user.role === 'SUPER_ADMIN') {
      socket.join('admin_support_room');
      console.log(`Admin ${socket.user.user_id} is ready for support.`);
    }

    if (socket.user.role === 'DRIVER') {
      socket.join(`driver_${socket.user.user_id}`);
      console.log(`Driver ${socket.user.user_id} joined tracking room.`);
    }

    socket.on('join_chat', (chatId: string) => {
      socket.join(chatId);
    });

    socket.on('join_parcel_tracking', (parcelId: string) => {
      socket.join(`parcel_${parcelId}`);
      console.log(`User ${socket.user.user_id} joined parcel tracking: ${parcelId}`);
    });

    socket.on('leave_parcel_tracking', (parcelId: string) => {
      socket.leave(`parcel_${parcelId}`);
      console.log(`User ${socket.user.user_id} left parcel tracking: ${parcelId}`);
    });

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.user.user_id} joined room: ${roomId}`);
    });

    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${socket.user.user_id} left room: ${roomId}`);
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
