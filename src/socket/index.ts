import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import colors from 'colors';
import { socketAuth } from './socket-auth';
import { TrackDriverServices } from '../app/v1/modules/track-driver-v2/track.service-v2';
import type { IUpdateLocation } from '../app/v1/modules/track-driver-v2/track-driver.interface';

// --- Interfaces ---
export interface IUpdateLocationPayload {
  parcel_id?: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
}

interface ISocketUser {
  user_id: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'DRIVER' | 'USER';
}

declare module 'socket.io' {
  interface Socket {
    user: ISocketUser;
  }
}

let io: Server;
export const onlineUsers = new Set<string>();

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.use(socketAuth());

  io.on('connection', (socket: Socket) => {
    const userId = socket.user.user_id;
    const userRole = socket.user.role;
    onlineUsers.add(userId);

    console.info(colors.blue(`🔌🟢 Socket Connected: ${userId} (${userRole})`));

    // ==========================================
    // 1. IDENTITY & ROLE-BASED ROOMS (For Chat)
    // ==========================================
    
    // Join private room for direct messaging
    socket.join(userId);

    // Welcome message
    socket.emit('chat message', 'Welcome to the chat!');

    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      socket.join('admin_support_room');
      console.log(colors.yellow(`Admin ${userId} joined support room.`));
    }

    if (userRole === 'DRIVER') {
      socket.join(`driver_${userId}`);
      console.log(colors.cyan(`Driver ${userId} joined tracking room.`));
    }

    // ==========================================
    // 2. CHAT & GENERAL ROOM EVENTS
    // ==========================================

    socket.on('chat message', (msg: string) => {
      console.log(`Message from ${userId}: ${msg}`);
      // Usually, you would emit this to a specific room or user here
    });

    socket.on('join_chat', (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${userId} joined chat: ${chatId}`);
    });

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room: ${roomId}`);
    });

    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${userId} left room: ${roomId}`);
    });

    // ==========================================
    // 3. DRIVER TRACKING EVENTS
    // ==========================================

    socket.on('update-driver-location', async (data: IUpdateLocationPayload) => {
      try {
        // Construct payload for the service
        const payload: IUpdateLocation = {
          driver_id: userId,
          latitude: data.latitude,
          longitude: data.longitude,
        };

        // Handle strict TypeScript optional types
        if (data.parcel_id !== undefined) payload.parcel_id = data.parcel_id;
        if (data.heading !== undefined) payload.heading = data.heading;
        if (data.speed !== undefined) payload.speed = data.speed;
        if (data.accuracy !== undefined) payload.accuracy = data.accuracy;

        await TrackDriverServices.updateDriverLocationInDB(payload);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', { message: 'Location update failed', detail: msg });
      }
    });

    // Customer joins tracking
    socket.on('join_parcel_tracking', async (parcelId: string) => {
      try {
        socket.join(`parcel_${parcelId}`);
        console.info(colors.green(`User ${userId} tracking parcel: ${parcelId}`));

        const currentLocation = await TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
        if (currentLocation) {
          socket.emit('driver_location_data', { success: true, data: currentLocation });
        }
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Driver not found' });
      }
    });

    socket.on('leave_parcel_tracking', (parcelId: string) => {
      socket.leave(`parcel_${parcelId}`);
      console.info(`User ${userId} stopped tracking parcel: ${parcelId}`);
    });

    socket.on('get_parcel_driver_location', async (parcelId: string) => {
      try {
        const location = await TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
        socket.emit('driver_location_data', { success: true, data: location });
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Driver not found' });
      }
    });

    // ==========================================
    // 4. DISCONNECT
    // ==========================================
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      console.info(colors.red(`🔌🔴 Socket Disconnected: ${userId}`));
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};