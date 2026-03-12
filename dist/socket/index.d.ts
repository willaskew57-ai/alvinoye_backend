import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
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
export declare const onlineUsers: Set<string>;
export declare const initSocket: (server: HttpServer) => Server;
export declare const getIO: () => Server;
export {};
//# sourceMappingURL=index.d.ts.map