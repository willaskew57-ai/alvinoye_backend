import mongoose from 'mongoose';
export declare const dbStatus: {
    isConnected: boolean;
    connectionState: "disconnected" | "connected" | "connecting" | "disconnecting";
};
export declare const connectDB: () => Promise<void>;
export declare const getDBStatus: () => {
    isConnected: boolean;
    state: mongoose.ConnectionStates;
    stateLabel: string | undefined;
};
//# sourceMappingURL=index.d.ts.map