import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { type JwtPayload } from 'jsonwebtoken';
import { socketAuth } from './socket-auth'; // Your custom middleware
import colors from 'colors';
import configs from '../config/env.config';
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

  // Use authentication middleware
  io.use(socketAuth());

  io.on('connection', (socket: Socket) => {
    const userId = socket.user.user_id;
    onlineUsers.add(userId);

    console.info(
      colors.blue(`🔌🟢 Socket Connected: ${userId} (${socket.user.role})`)
    );

    // Join driver's room for multi-device sync (matches service emits)
    socket.join(`driver_${userId}`);

    /**
     * EVENT: update-driver-location
     * Used by: Drivers
     * Purpose: Updates DB and broadcasts live movement to customers tracking the parcel.
     */
    socket.on(
      'update-driver-location',
      async (data: IUpdateLocationPayload) => {
        try {
          // Use already-authenticated user from socket middleware
          const driverId = socket.user.user_id;

          // Build payload and only include optional fields when defined to satisfy
          // `exactOptionalPropertyTypes` (avoid passing `undefined` where not allowed)
          const payload: IUpdateLocation = {
            driver_id: driverId,
            latitude: data.latitude,
            longitude: data.longitude,
          };

          if (data.parcel_id !== undefined) payload.parcel_id = data.parcel_id;
          if (data.heading !== undefined) payload.heading = data.heading;
          if (data.speed !== undefined) payload.speed = data.speed;
          if (data.accuracy !== undefined) payload.accuracy = data.accuracy;

          await TrackDriverServices.updateDriverLocationInDB(payload);
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          socket.emit('error', {
            message: 'Location update failed',
            detail: msg,
          });
        }
      }
    );

    /**
     * EVENT: join_parcel_tracking
     * Used by: Customers
     * Purpose: Joins a parcel room and receives the driver's CURRENT location immediately.
     */
    socket.on('join_parcel_tracking', async (parcelId: string) => {
      try {
        socket.join(`parcel_${parcelId}`);
        console.info(`User ${userId} started tracking parcel: ${parcelId}`);

        // Fetch current location immediately so the map isn't empty on load
        const currentLocation =
          await TrackDriverServices.getParcelDriverLocationFromDB(parcelId);

        if (currentLocation) {
          socket.emit('driver_location_data', {
            success: true,
            data: currentLocation,
          });
        }
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Driver not found' });
      }
    });

    // Allow clients to request the current driver location without joining the room
    socket.on('get_parcel_driver_location', async (parcelId: string) => {
      try {
        const location =
          await TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
        socket.emit('driver_location_data', {
          success: true,
          data: location,
        });
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Driver not found' });
      }
    });

    /**
     * EVENT: leave_parcel_tracking
     * Used by: Customers
     * Purpose: Stops receiving live updates for a parcel.
     */
    socket.on('leave_parcel_tracking', (parcelId: string) => {
      socket.leave(`parcel_${parcelId}`);
      console.info(`User ${userId} stopped tracking parcel: ${parcelId}`);
    });

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
