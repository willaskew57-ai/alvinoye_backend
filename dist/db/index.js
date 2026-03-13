"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBStatus = exports.connectDB = exports.dbStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = __importDefault(require("../config/env.config"));
exports.dbStatus = {
    isConnected: false,
    connectionState: 'disconnected',
};
const connectDB = async () => {
    try {
        const dbUri = env_config_1.default.database_url;
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.connection.on('connected', () => {
            exports.dbStatus.isConnected = true;
            exports.dbStatus.connectionState = 'connected';
            console.log('✅ MongoDB Connected Successfully');
        });
        mongoose_1.default.connection.on('connecting', () => {
            exports.dbStatus.isConnected = false;
            exports.dbStatus.connectionState = 'connecting';
            console.log('🔄 Connecting to MongoDB...');
        });
        mongoose_1.default.connection.on('disconnected', () => {
            exports.dbStatus.isConnected = false;
            exports.dbStatus.connectionState = 'disconnected';
            console.log('❌ MongoDB Disconnected');
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB Error:', err);
        });
        await mongoose_1.default.connect(dbUri, {
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
exports.connectDB = connectDB;
const attemptFallbackConnection = async () => {
    try {
        const fallbackUri = env_config_1.default.database_url?.replace('mongodb+srv://', 'mongodb://');
        if (!fallbackUri) {
            throw new Error('No fallback URI available');
        }
        console.log('🔄 Using fallback connection method...');
        await mongoose_1.default.connect(fallbackUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
    }
    catch (fallbackErr) {
        console.error('💥 Fallback connection also failed:', fallbackErr);
        process.exit(1);
    }
};
const getDBStatus = () => {
    return {
        isConnected: exports.dbStatus.isConnected,
        state: mongoose_1.default.connection.readyState,
        stateLabel: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose_1.default.connection.readyState],
    };
};
exports.getDBStatus = getDBStatus;
//# sourceMappingURL=index.js.map