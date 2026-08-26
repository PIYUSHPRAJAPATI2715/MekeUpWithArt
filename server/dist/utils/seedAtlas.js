"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = __importDefault(require("dns"));
dns_1.default.setDefaultResultOrder('ipv4first');
const mongoose_1 = __importDefault(require("mongoose"));
const seed_1 = require("./seed");
const ATLAS_URI = 'mongodb+srv://Makeup:WBWH4FYqfIzAXARe@cluster0.rgkjhjo.mongodb.net/makeupwithart?retryWrites=true&w=majority';
const run = async () => {
    try {
        console.log('[Atlas Direct Seed] Connecting to MongoDB Atlas...');
        await mongoose_1.default.connect(ATLAS_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('[Atlas Direct Seed] Connected successfully! Seeding collections...');
        await (0, seed_1.seedDatabaseData)();
        console.log('[Atlas Direct Seed] All demo data and admin users successfully created!');
        process.exit(0);
    }
    catch (err) {
        console.error('[Atlas Direct Seed Error]:', err.message || err);
        process.exit(1);
    }
};
run();
