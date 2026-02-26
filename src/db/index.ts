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

    // Set mongoose options before connecting
    mongoose.set('strictQuery', false);

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

    // Add connection options
    await mongoose.connect(dbUri!, {
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4, helps with DNS issues
    });
    
  } catch (err) {
    console.error('💥 Database connection error:', err);
    
    // Try alternative connection method if DNS fails
    if ((err as any).code === 'ETIMEOUT') {
      console.log('🔄 Attempting fallback connection...');
      await attemptFallbackConnection();
    } else {
      process.exit(1);
    }
  }
};

// Fallback connection function
const attemptFallbackConnection = async () => {
  try {
    // Get the standard connection string from MongoDB Atlas
    // This should be the mongodb:// version, not mongodb+srv://
    const fallbackUri = configs.database_url?.replace('mongodb+srv://', 'mongodb://');
    
    if (!fallbackUri) {
      throw new Error('No fallback URI available');
    }

    console.log('🔄 Using fallback connection method...');
    await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  } catch (fallbackErr) {
    console.error('💥 Fallback connection also failed:', fallbackErr);
    process.exit(1);
  }
};

// Export connection status checker
export const getDBStatus = () => {
  return {
    isConnected: dbStatus.isConnected,
    state: mongoose.connection.readyState,
    stateLabel: ['disconnected', 'connected', 'connecting', 'disconnecting'][
      mongoose.connection.readyState
    ],
  };
};