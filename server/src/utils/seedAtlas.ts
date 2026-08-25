import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';
import { seedDatabaseData } from './seed';

const ATLAS_URI = 'mongodb+srv://Makeup:WBWH4FYqfIzAXARe@cluster0.rgkjhjo.mongodb.net/makeupwithart?retryWrites=true&w=majority';

const run = async () => {
  try {
    console.log('[Atlas Direct Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('[Atlas Direct Seed] Connected successfully! Seeding collections...');
    await seedDatabaseData();
    console.log('[Atlas Direct Seed] All demo data and admin users successfully created!');
    process.exit(0);
  } catch (err: any) {
    console.error('[Atlas Direct Seed Error]:', err.message || err);
    process.exit(1);
  }
};

run();
