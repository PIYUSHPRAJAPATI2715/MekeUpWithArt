import mongoose from 'mongoose';
import { config } from './env';
import { Service } from '../models/Service';
import { seedDatabaseData } from '../utils/seed';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed database catalog upon connection if empty
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Database] Empty catalog detected. Auto-seeding database...');
      await seedDatabaseData();
    }
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB:`, error);
    process.exit(1);
  }
};
