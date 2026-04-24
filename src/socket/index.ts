import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import colors from 'colors';
import { socketAuth } from './socket-auth';
import { TrackDriverServices } from '../app/v1/modules/track-driver-v2/track.service-v2';
import type { IUpdateLocation } from '../app/v1/modules/track-driver-v2/track-driver.interface';
import { DriverServices } from '../app/v1/modules/driver/driver.service';

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
    console.log('[Socket] New connection event fired');
    const userId = socket.user.user_id;
    const userRole = socket.user.role;
    onlineUsers.add(userId);

    console.info(colors.blue(`🔌🟢 Socket Connected: ${userId} (${userRole})`));

    // ==========================================
    // 1. IDENTITY & ROLE-BASED ROOMS (For Chat)
    // ==========================================
    
    // Join private room for direct messaging
    // console.log(`[Socket] User ${userId} joining private room: ${userId}`);
    socket.join(userId);

    // Welcome message
    // console.log(`[Socket] Emitting 'chat message' to user ${userId}`);
    socket.emit('chat message', 'Welcome to the chat!');

    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      // console.log(`[Socket] Admin ${userId} joining room: admin_support_room`);
      socket.join('admin_support_room');
      // console.log(colors.yellow(`Admin ${userId} joined support room.`));
    }

    if (userRole === 'DRIVER') {
      console.log(`[Socket] Driver ${userId} joining room: driver_${userId}`);
      socket.join(`driver_${userId}`);
      console.log(colors.cyan(`Driver ${userId} joined tracking room.`));
    }

    // ==========================================
    // 2. CHAT & GENERAL ROOM EVENTS
    // ==========================================

    socket.on('chat message', (msg: string) => {
      console.log(`[Socket] Received 'chat message' from ${userId}:`, msg);
      // Usually, you would emit this to a specific room or user here
    });

    socket.on('join_chat', (chatId: string) => {
      console.log(`[Socket] User ${userId} joining chat room: ${chatId}`);
      socket.join(chatId);
      console.log(`[Socket] User ${userId} joined chat: ${chatId}`);
    });

    socket.on('join_room', (roomId: string) => {
      console.log(`[Socket] User ${userId} joining room: ${roomId}`);
      socket.join(roomId);
      console.log(`[Socket] User ${userId} joined room: ${roomId}`);
    });

    socket.on('leave_room', (roomId: string) => {
      console.log(`[Socket] User ${userId} leaving room: ${roomId}`);
      socket.leave(roomId);
      console.log(`[Socket] User ${userId} left room: ${roomId}`);
    });

    // ==========================================
    // 3. DRIVER TRACKING EVENTS (Updated)
    // ==========================================

    socket.on('update-driver-location', async (data: IUpdateLocationPayload) => {
      console.log(`[Socket] Received 'update-driver-location' from driver ${userId}:`, data);
      
      try {
        // 1. Construct the payload for the database
        const payload: IUpdateLocation = {
          driver_id: userId,
          latitude: data.latitude,
          longitude: data.longitude,
        };

        // Handle optional fields
        if (data.parcel_id !== undefined) payload.parcel_id = data.parcel_id;
        if (data.heading !== undefined) payload.heading = data.heading;
        if (data.speed !== undefined) payload.speed = data.speed;
        if (data.accuracy !== undefined) payload.accuracy = data.accuracy;

        // 2. Persist the location in the Database (so it's saved if the user refreshes)
        await TrackDriverServices.updateDriverLocationInDB(payload);

        // 3. BROADCAST TO THE ROOM (The missing piece)
        // If a parcel_id is provided, we send the update to everyone in that parcel's room
        if (data.parcel_id) {
          const roomName = `parcel_${data.parcel_id}`;
          
          console.log(colors.white(`[Socket] Broadcasting live update to room: ${roomName}`));

          // io.to(roomName) sends the event to ALL sockets that joined this room 
          // (including the Owner/Customer)
          io.to(roomName).emit('driver_location_update', {
            success: true,
            data: {
              ...payload,
              timestamp: new Date().toISOString()
            }
          });
        }

      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error(colors.red(`[Socket] Location update error: ${msg}`));
        
        // Notify the driver that the update failed
        socket.emit('error', { 
          message: 'Location update failed', 
          detail: msg 
        });
      }
    });

    // Customer joins tracking
    socket.on('join_parcel_tracking', async (parcelId: string) => {
      console.log(`[Socket] User ${userId} joining parcel tracking: ${parcelId}`);
      try {
        console.log(`[Socket] User ${userId} joining parcel tracking room: parcel_${parcelId}`);
        socket.join(`parcel_${parcelId}`);
        console.info(colors.green(`User ${userId} tracking parcel: ${parcelId}`));

        const currentLocation = await TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
        if (currentLocation) {
          console.log(`[Socket] Emitting 'driver_location_data' to user ${userId} for parcel ${parcelId}`);
          socket.emit('driver_location_data', { success: true, data: currentLocation });

          console.log(`currentLocation for parcel ${parcelId}:`, currentLocation);
        }
      } catch (error: any) {
        console.log(`[Socket] Emitting 'error' to ${userId} for join_parcel_tracking failure`);
        socket.emit('error', { message: error.message || 'Driver not found' });
      }
    });

    socket.on('leave_parcel_tracking', (parcelId: string) => {
      console.log(`[Socket] User ${userId} leaving parcel tracking: ${parcelId}`);
      socket.leave(`parcel_${parcelId}`);
      console.info(`User ${userId} stopped tracking parcel: ${parcelId}`);
    });

    socket.on('get_parcel_driver_location', async (parcelId: string) => {
      console.log(`[Socket] Received 'get_parcel_driver_location' from user ${userId} for parcel ${parcelId}`);
      try {
        const location = await TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
        console.log(`[Socket] Emitting 'driver_location_data' to user ${userId} for parcel ${parcelId}`);
        socket.emit('driver_location_data', { success: true, data: location });
      } catch (error: any) {
        console.log(`[Socket] Emitting 'error' to ${userId} for get_parcel_driver_location failure`);
        socket.emit('error', { message: error.message || 'Driver not found' });
      }
    });

    // ==========================================
    // 4. PARCEL DISCOVERY EVENTS
    // ==========================================

    const parcelThrottle = new Map<string, number>();
    const THROTTLE_MS = 2000;

    socket.on('driver:location-update', async (data: {
      currentLat: number;
      currentLng: number;
      heading?: number;
      savedRoutePolyline?: string;
      routeBufferMeters?: number;
      directionAngleThreshold?: number;
      radiusMeters?: number;
    }) => {
      // console.log(`[Socket] Received 'driver:location-update' from driver ${userId}:`, data);
      if (userRole !== 'DRIVER') {
        console.log(`[Socket] Emitting 'error' to ${userId}: Only drivers can update location`);
        socket.emit('error', { message: 'Only drivers can update location for parcel discovery' });
        return;
      }

      const now = Date.now();
      const lastUpdate = parcelThrottle.get(userId) || 0;
      if (now - lastUpdate < THROTTLE_MS) {
        console.log(`[Socket] Throttling location update for driver ${userId} (${now - lastUpdate}ms since last)`);
        return;
      }
      parcelThrottle.set(userId, now);

      try {
        const query = {
          currentLat: data.currentLat.toString(),
          currentLng: data.currentLng.toString(),
          heading: data.heading?.toString(),
          savedRoutePolyline: data.savedRoutePolyline,
          routeBufferMeters: data.routeBufferMeters?.toString(),
          directionAngleThreshold: data.directionAngleThreshold?.toString(),
          radiusMeters: data.radiusMeters?.toString() || '1500',
          limit: '10',
          page: '1',
        };

        // console.log(`[Socket] Fetching available parcels for driver ${userId} with query:`, query);
        const parcels = await DriverServices.getAvailableParcelsFromDB(userId, query);
        console.log(`[Socket] Found ${parcels.data.length} parcels for driver ${userId}, emitting 'driver:available-parcels'`);
        socket.emit('driver:available-parcels', {
          success: true,
          data: parcels.data,
          meta: parcels.meta,
          timestamp: now,
        });
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Socket] Error fetching parcels for driver ${userId}:`, msg);
        console.log(`[Socket] Emitting 'error' to ${userId} for driver:location-update failure`);
        socket.emit('error', { message: 'Failed to get available parcels', detail: msg });
      }
    });

    // ==========================================
    // 5. DISCONNECT
    // ==========================================
    socket.on('disconnect', () => {
      console.log(`[Socket] Received 'disconnect' event from user ${userId}`);
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