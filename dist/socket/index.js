"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = exports.onlineUsers = void 0;
const socket_io_1 = require("socket.io");
const colors_1 = __importDefault(require("colors"));
const socket_auth_1 = require("./socket-auth");
const track_service_v2_1 = require("../app/v1/modules/track-driver-v2/track.service-v2");
const driver_service_1 = require("../app/v1/modules/driver/driver.service");
let io;
exports.onlineUsers = new Set();
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: '*' },
    });
    io.use((0, socket_auth_1.socketAuth)());
    io.on('connection', (socket) => {
        const userId = socket.user.user_id;
        const userRole = socket.user.role;
        exports.onlineUsers.add(userId);
        console.info(colors_1.default.blue(`🔌🟢 Socket Connected: ${userId} (${userRole})`));
        // ==========================================
        // 1. IDENTITY & ROLE-BASED ROOMS (For Chat)
        // ==========================================
        // Join private room for direct messaging
        socket.join(userId);
        // Welcome message
        socket.emit('chat message', 'Welcome to the chat!');
        if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
            socket.join('admin_support_room');
            console.log(colors_1.default.yellow(`Admin ${userId} joined support room.`));
        }
        if (userRole === 'DRIVER') {
            socket.join(`driver_${userId}`);
            console.log(colors_1.default.cyan(`Driver ${userId} joined tracking room.`));
        }
        // ==========================================
        // 2. CHAT & GENERAL ROOM EVENTS
        // ==========================================
        socket.on('chat message', (msg) => {
            console.log(`Message from ${userId}: ${msg}`);
            // Usually, you would emit this to a specific room or user here
        });
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${userId} joined chat: ${chatId}`);
        });
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${userId} joined room: ${roomId}`);
        });
        socket.on('leave_room', (roomId) => {
            socket.leave(roomId);
            console.log(`User ${userId} left room: ${roomId}`);
        });
        // ==========================================
        // 3. DRIVER TRACKING EVENTS
        // ==========================================
        socket.on('update-driver-location', async (data) => {
            try {
                // Construct payload for the service
                const payload = {
                    driver_id: userId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                };
                // Handle strict TypeScript optional types
                if (data.parcel_id !== undefined)
                    payload.parcel_id = data.parcel_id;
                if (data.heading !== undefined)
                    payload.heading = data.heading;
                if (data.speed !== undefined)
                    payload.speed = data.speed;
                if (data.accuracy !== undefined)
                    payload.accuracy = data.accuracy;
                await track_service_v2_1.TrackDriverServices.updateDriverLocationInDB(payload);
            }
            catch (error) {
                const msg = error instanceof Error ? error.message : 'Unknown error';
                socket.emit('error', { message: 'Location update failed', detail: msg });
            }
        });
        // Customer joins tracking
        socket.on('join_parcel_tracking', async (parcelId) => {
            try {
                socket.join(`parcel_${parcelId}`);
                console.info(colors_1.default.green(`User ${userId} tracking parcel: ${parcelId}`));
                const currentLocation = await track_service_v2_1.TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
                if (currentLocation) {
                    socket.emit('driver_location_data', { success: true, data: currentLocation });
                }
            }
            catch (error) {
                socket.emit('error', { message: error.message || 'Driver not found' });
            }
        });
        socket.on('leave_parcel_tracking', (parcelId) => {
            socket.leave(`parcel_${parcelId}`);
            console.info(`User ${userId} stopped tracking parcel: ${parcelId}`);
        });
        socket.on('get_parcel_driver_location', async (parcelId) => {
            try {
                const location = await track_service_v2_1.TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
                socket.emit('driver_location_data', { success: true, data: location });
            }
            catch (error) {
                socket.emit('error', { message: error.message || 'Driver not found' });
            }
        });
        // ==========================================
        // 4. PARCEL DISCOVERY EVENTS
        // ==========================================
        const parcelThrottle = new Map();
        const THROTTLE_MS = 2000;
        socket.on('driver:location-update', async (data) => {
            if (userRole !== 'DRIVER') {
                socket.emit('error', { message: 'Only drivers can update location for parcel discovery' });
                return;
            }
            const now = Date.now();
            const lastUpdate = parcelThrottle.get(userId) || 0;
            if (now - lastUpdate < THROTTLE_MS) {
                return;
            }
            parcelThrottle.set(userId, now);
            try {
                const query = {
                    currentLat: data.currentLat.toString(),
                    currentLng: data.currentLng.toString(),
                    heading: data.heading?.toString(),
                    destinationLat: data.destinationLat?.toString(),
                    destinationLng: data.destinationLng?.toString(),
                    savedRoutePolyline: data.savedRoutePolyline,
                    routeBufferMeters: data.routeBufferMeters?.toString(),
                    directionAngleThreshold: data.directionAngleThreshold?.toString(),
                    radiusMeters: data.radiusMeters?.toString() || '1500',
                    limit: '10',
                    page: '1',
                };
                const parcels = await driver_service_1.DriverServices.getAvailableParcelsFromDB(userId, query);
                socket.emit('driver:available-parcels', {
                    success: true,
                    data: parcels.data,
                    meta: parcels.meta,
                    timestamp: now,
                });
            }
            catch (error) {
                const msg = error instanceof Error ? error.message : 'Unknown error';
                socket.emit('error', { message: 'Failed to get available parcels', detail: msg });
            }
        });
        // ==========================================
        // 5. DISCONNECT
        // ==========================================
        socket.on('disconnect', () => {
            exports.onlineUsers.delete(userId);
            console.info(colors_1.default.red(`🔌🔴 Socket Disconnected: ${userId}`));
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error('Socket.io not initialized!');
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=index.js.map