"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const seed_1 = require("./seed");
// Direct connection string bypassing SRV lookup
const DIRECT_URI = 'mongodb://Makeup:WBWH4FYqfIzAXARe@cluster0-shard-00-00.rgkjhjo.mongodb.net:27017,cluster0-shard-00-01.rgkjhjo.mongodb.net:27017,cluster0-shard-00-02.rgkjhjo.mongodb.net:27017/makeupwithart?ssl=true&replicaSet=atlas-13byp9-shard-0&authSource=admin&retryWrites=true&w=majority';
const SRV_URI = 'mongodb+srv://Makeup:WBWH4FYqfIzAXARe@cluster0.rgkjhjo.mongodb.net/makeupwithart?retryWrites=true&w=majority';
const run = async () => {
    console.log('[Direct Seed] Starting database seeding...');
    try {
        console.log('[Direct Seed] Trying direct replica set URI...');
        await mongoose_1.default.connect(DIRECT_URI, { serverSelectionTimeoutMS: 5000 });
    }
    catch (err1) {
        console.log('[Direct Seed] Direct URI notice:', err1.message);
        console.log('[Direct Seed] Trying SRV URI...');
        await mongoose_1.default.connect(SRV_URI, { serverSelectionTimeoutMS: 5000 });
    }
    console.log('[Direct Seed] Connected to MongoDB Atlas successfully!');
    await (0, seed_1.seedDatabaseData)();
    console.log('[Direct Seed] SUCCESS! MongoDB Atlas populated with all services, packages, reviews, staff, and admin accounts.');
    process.exit(0);
};
run().catch((err) => {
    console.error('[Direct Seed Fatal Error]:', err);
    process.exit(1);
});
