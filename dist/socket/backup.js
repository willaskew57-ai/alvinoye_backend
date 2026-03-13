"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const socket_auth_1 = require("./socket-auth");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: '*' },
    });
    io.use((0, socket_auth_1.socketAuth)());
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.user);
        socket.on('chat message', (msg) => {
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
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
        });
        socket.on('join_parcel_tracking', (parcelId) => {
            socket.join(`parcel_${parcelId}`);
            console.log(`User ${socket.user.user_id} joined parcel tracking: ${parcelId}`);
        });
        socket.on('leave_parcel_tracking', (parcelId) => {
            socket.leave(`parcel_${parcelId}`);
            console.log(`User ${socket.user.user_id} left parcel tracking: ${parcelId}`);
        });
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.user.user_id} joined room: ${roomId}`);
        });
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
exports.initSocket = initSocket;
const getIO = () => {
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=backup.js.map