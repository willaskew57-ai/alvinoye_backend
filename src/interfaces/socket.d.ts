import 'socket.io';
import type { TUserPayload } from '../interfaces';

declare module 'socket.io' {
  interface Socket {
    user: TUserPayload;
  }
}
