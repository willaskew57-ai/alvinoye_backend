import mongoose from 'mongoose';
import configs from '../config/env.config';

// Global DB status object for health checks
export const dbStatus = {
  isConnected: false,
  connectionState: 'disconnected' as
    | 'disconnected'
    | 'connected'
    | 'connecting'
    | 'disconnecting',
};

export const connectDB = async () => {
  try {
    const dbUri = configs.database_url;

    // Listen to connection events
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

    await mongoose.connect(dbUri!);
  } catch (err) {
    console.error('💥 Database connection error:', err);
    process.exit(1);
  }
};

// Export connection status checker
export const getDBStatus = () => {
  return {
    isConnected: dbStatus.isConnected,
    state: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting
    stateLabel: ['disconnected', 'connected', 'connecting', 'disconnecting'][
      mongoose.connection.readyState
    ],
  };
};
