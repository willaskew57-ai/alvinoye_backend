import mongoose from 'mongoose';
import configs from '../config/env.config';
export const dbStatus = {
    isConnected: false,
    connectionState: 'disconnected',
};
export const connectDB = async () => {
    try {
        const dbUri = configs.database_url;
        mongoose.set('strictQuery', false);
        mongoose.connection.on('connected', () => {
            dbStatus.isConnected = true;
            dbStatus.connectionState = 'connected';
            console.log('✅ MongoDB Connected Successfully');
        });
        mongoose.connection.on('connecting', () => {
            dbStatus.isConnected = false;
            dbStatus.connectionState = 'connecting';
            console.log('🔄 Connecting to MongoDB...');
        });
        mongoose.connection.on('disconnected', () => {
            dbStatus.isConnected = false;
            dbStatus.connectionState = 'disconnected';
            console.log('❌ MongoDB Disconnected');
        });
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB Error:', err);
        });
        await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
        });
    }
    catch (err) {
        console.error('💥 Database connection error:', err);
        if (err.code === 'ETIMEOUT') {
            console.log('🔄 Attempting fallback connection...');
            await attemptFallbackConnection();
        }
        else {
            process.exit(1);
        }
    }
};
const attemptFallbackConnection = async () => {
    try {
        const fallbackUri = configs.database_url?.replace('mongodb+srv://', 'mongodb://');
        if (!fallbackUri) {
            throw new Error('No fallback URI available');
        }
        console.log('🔄 Using fallback connection method...');
        await mongoose.connect(fallbackUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
    }
    catch (fallbackErr) {
        console.error('💥 Fallback connection also failed:', fallbackErr);
        process.exit(1);
    }
};
export const getDBStatus = () => {
    return {
        isConnected: dbStatus.isConnected,
        state: mongoose.connection.readyState,
        stateLabel: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    };
};
//# sourceMappingURL=index.js.map