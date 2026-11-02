"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broadcast = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BroadcastLogSchema = new mongoose_1.Schema({
    phone: { type: String, required: true },
    name: { type: String },
    status: { type: String, enum: ['SENT', 'FAILED', 'PENDING'], default: 'PENDING' },
    error: { type: String },
    timestamp: { type: Date, default: Date.now },
}, { _id: false });
const BroadcastSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    targetAudience: {
        type: String,
        enum: ['ALL', 'CUSTOMERS', 'BOOKINGS', 'CONTACTS', 'CUSTOM'],
        default: 'ALL',
    },
    customNumbers: [{ type: String }],
    status: {
        type: String,
        enum: ['DRAFT', 'SENDING', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED'],
        default: 'DRAFT',
    },
    recipientCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    logs: [BroadcastLogSchema],
    sentAt: { type: Date },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
exports.Broadcast = mongoose_1.default.model('Broadcast', BroadcastSchema);
