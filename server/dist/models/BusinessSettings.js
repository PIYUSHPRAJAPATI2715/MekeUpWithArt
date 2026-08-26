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
exports.BusinessSettings = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BusinessSettingsSchema = new mongoose_1.Schema({
    businessName: { type: String, default: 'MAKEUP WITH ART' },
    phoneNumbers: [{ type: String }],
    email: { type: String, default: 'makeupwitharto@gmail.com' },
    address: { type: String, default: 'Pillar No. 113, Shyam Nagar Metro Station' },
    instagram: { type: String, default: 'makeup.with.art' },
    googleMapsIframeUrl: { type: String, default: 'https://maps.google.com/maps?q=Shyam+Nagar+Metro+Station+Jaipur&t=&z=15&ie=UTF8&iwloc=&output=embed' },
    heroTitle: { type: String, default: 'Your Beauty. Your Style. Your Art.' },
    heroSubheading: { type: String, default: 'Premium Unisex Salon Services Crafted Around You.' },
    aboutContent: { type: String, default: 'MAKEUP WITH ART is a premier unisex beauty salon dedicated to elevating your personal style. We blend modern techniques with artistic elegance to deliver bespoke hair, skin, makeup, and nail transformations.' },
    whyChooseUs: [
        {
            title: { type: String, default: 'Experienced Professionals' },
            description: { type: String, default: 'Master stylists and cosmetologists trained in international techniques.' }
        },
        {
            title: { type: String, default: 'Premium Products' },
            description: { type: String, default: 'Top-tier dermatologist tested & cruelty-free luxury cosmetics.' }
        },
        {
            title: { type: String, default: 'Personalized Service' },
            description: { type: String, default: 'Tailored beauty consultations for your unique features and style.' }
        },
        {
            title: { type: String, default: 'Hygienic Environment' },
            description: { type: String, default: 'Hospital-grade sanitization and disposable single-use kits.' }
        }
    ],
    footerNotice: { type: String, default: '© 2026 MAKEUP WITH ART. All Rights Reserved.' }
}, { timestamps: true });
exports.BusinessSettings = mongoose_1.default.model('BusinessSettings', BusinessSettingsSchema);
