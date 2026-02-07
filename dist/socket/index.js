import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './socket-auth';
// Use the Server type from socket.io
let io;
export const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: '*' },
    });
    //  auth middleware active
    io.use(socketAuth());
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.user);
        // just for testing
        socket.on('chat message', (msg) => {
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
        // 3. If Driver, join driver-specific room for location tracking
        if (socket.user.role === 'DRIVER') {
            socket.join(`driver_${socket.user.user_id}`);
            console.log(`Driver ${socket.user.user_id} joined tracking room.`);
        }
        // 4. Handle joining specific chat rooms
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
        });
        // 5. Handle joining parcel tracking rooms (for customers)
        socket.on('join_parcel_tracking', (parcelId) => {
            socket.join(`parcel_${parcelId}`);
            console.log(`User ${socket.user.user_id} joined parcel tracking: ${parcelId}`);
        });
        // 6. Handle leaving parcel tracking rooms
        socket.on('leave_parcel_tracking', (parcelId) => {
            socket.leave(`parcel_${parcelId}`);
            console.log(`User ${socket.user.user_id} left parcel tracking: ${parcelId}`);
        });
        // 7. Handle generic room joining
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.user.user_id} joined room: ${roomId}`);
        });
        // 8. Handle generic room leaving
        socket.on('leave_room', (roomId) => {
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
//# sourceMappingURL=index.js.map