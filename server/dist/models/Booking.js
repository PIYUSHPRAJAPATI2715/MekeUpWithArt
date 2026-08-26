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
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BookingSchema = new mongoose_1.Schema({
    bookingId: { type: String, required: true, unique: true },
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['service', 'package'], required: true },
    itemId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    itemName: { type: String, required: true },
    variantName: { type: String, default: '' },
    price: { type: Number, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "10:30"
    duration: { type: Number, required: true, default: 45 },
    staff: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff' },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-Show'],
        default: 'Pending',
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    notes: { type: String, default: '' },
    cancellationReason: { type: String, default: '' },
}, { timestamps: true });
BookingSchema.index({ customer: 1 });
BookingSchema.index({ date: 1, timeSlot: 1, status: 1 });
exports.Booking = mongoose_1.default.model('Booking', BookingSchema);
