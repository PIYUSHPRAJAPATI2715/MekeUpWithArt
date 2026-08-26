"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const Service_1 = require("../models/Service");
const seed_1 = require("../utils/seed");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.config.MONGODB_URI);
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
        // Auto-seed database catalog upon connection if empty
        const serviceCount = await Service_1.Service.countDocuments();
        if (serviceCount === 0) {
            console.log('[Database] Empty catalog detected. Auto-seeding database...');
            await (0, seed_1.seedDatabaseData)();
        }
    }
    catch (error) {
        console.error(`[Database Error] Failed to connect to MongoDB:`, error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
