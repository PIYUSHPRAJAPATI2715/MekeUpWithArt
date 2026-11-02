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
const defaultTerms = `### 1. Appointment Bookings & Schedule
- We recommend booking your appointments at least 24 hours in advance to secure your preferred slot and stylist.
- Walk-ins are accepted subject to slot availability.
- Please arrive 10 minutes prior to your scheduled appointment. In case of delays exceeding 15 minutes, your slot may need to be rescheduled to prevent inconvenience to other clients.

### 2. Bridal & Groom Couture Packages
- Bridal, Pre-Bridal, and Grooming packages require a confirmed booking and an initial advance deposit.
- Complimentary consultations and patch tests are available for bridal makeup and hair smoothing treatments prior to the main ceremony.

### 3. Health & Hygiene Protocols
- All our styling tools and equipment undergo clinical UV sterilization between sessions. Single-use disposable aprons, blades, and towels are used for all grooming and facial procedures.
- Please notify our stylists of any allergies, sensitive skin conditions, or past reactions before receiving chemical treatments, hair colors, or facials.

### 4. Pricing & Payments
- All service rates displayed are inclusive of standard salon taxes and master stylist charges.
- Any additional requests, hair length upgrades, or premium custom nail charms will be quoted transparently before service commencement.
- We accept Cash, UPI, Credit/Debit cards, and Net Banking.`;
const defaultPrivacy = `### 1. Information We Collect
- Contact Information: Name, phone number, email address, and appointment preferences provided when booking or contacting MAKEUP WITH ART.
- Usage Data: Information collected via Google Analytics 4 and Google Ads conversion tracking to measure site interactions and enhance user experience.

### 2. How We Use Your Information
- To confirm, schedule, reschedule, or notify you regarding your salon bookings.
- To send important appointment reminders and exclusive VIP offers via SMS or WhatsApp (only with your prior engagement).
- To optimize our salon services and marketing campaigns.

### 3. Data Protection & Sharing
- We respect your privacy. Your personal phone numbers and booking details are never sold, traded, or shared with unauthorized third-party advertisers.
- Access to client data is strictly restricted to salon management and authorized administrative staff.

### 4. Contact Us
For any privacy concerns or to request data removal, contact us at makeupwitharto@gmail.com or call +91 9352769045.`;
const defaultCancellation = `### 1. Appointment Rescheduling & Cancellations
- Clients can reschedule or cancel an appointment up to 2 hours before the scheduled time slot free of charge by calling us or managing via their profile.
- For bridal and premium groom packages, cancellations must be communicated at least 48 hours prior to the date.

### 2. Refunds
- Service fees once rendered are non-refundable; however, if you are not 100% satisfied with a haircut, nail shape, or treatment, our Art Director will gladly offer a complimentary correction within 48 hours.
- Advance deposits for bulk packages can be retained as salon credit valid for 6 months.`;
const BusinessSettingsSchema = new mongoose_1.Schema({
    businessName: { type: String, default: 'MAKEUP WITH ART' },
    phoneNumbers: [{ type: String, default: ['9352769045', '7575939735'] }],
    email: { type: String, default: 'makeupwitharto@gmail.com' },
    address: { type: String, default: 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur' },
    instagram: { type: String, default: 'makeup.with.art' },
    googleMapsIframeUrl: {
        type: String,
        default: 'https://maps.google.com/maps?q=Pillar+No+113+Shyam+Nagar+Metro+Station+Jaipur&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    heroTitle: { type: String, default: 'Your Beauty. Your Style. Your Art.' },
    heroSubheading: {
        type: String,
        default: 'Jaipur\'s Top-Rated Luxury Unisex Salon & HD Bridal Studio at Shyam Nagar Metro Station.',
    },
    aboutContent: {
        type: String,
        default: 'MAKEUP WITH ART is a premier unisex beauty salon dedicated to elevating your personal style. We blend modern techniques with artistic elegance to deliver bespoke hair, skin, makeup, and nail transformations.',
    },
    aboutMission: {
        type: String,
        default: 'To deliver world-class salon artistry, clinical hygiene, and confidence-boosting transformations tailored to every individual using international organic formulations.',
    },
    aboutVision: {
        type: String,
        default: 'To be Rajasthan\'s most trusted bridal studio and trendsetting unisex grooming destination where luxury meets accessible artistry.',
    },
    stats: {
        happyClients: { type: Number, default: 4500 },
        experienceYears: { type: Number, default: 8 },
        expertStylists: { type: Number, default: 12 },
        rating: { type: Number, default: 4.9 },
    },
    announcementBanner: {
        enabled: { type: Boolean, default: true },
        text: {
            type: String,
            default: '✨ Special Festive Offer: 20% OFF on HD Airbrush Bridal & Groom Packages! Book Online Today.',
        },
        link: { type: String, default: '/packages' },
    },
    socialLinks: {
        instagram: { type: String, default: 'https://instagram.com/makeup.with.art' },
        facebook: { type: String, default: 'https://facebook.com/makeupwithart' },
        youtube: { type: String, default: 'https://youtube.com' },
        whatsapp: { type: String, default: 'https://wa.me/919352769045' },
    },
    termsAndConditions: { type: String, default: defaultTerms },
    privacyPolicy: { type: String, default: defaultPrivacy },
    cancellationPolicy: { type: String, default: defaultCancellation },
    whyChooseUs: [
        {
            title: { type: String, default: 'Master Certified Art Directors' },
            description: { type: String, default: 'Expert stylists trained in international hair smoothing, Russian lash lifts & HD bridal makeup.' },
        },
        {
            title: { type: String, default: '100% Genuine Luxury Products' },
            description: { type: String, default: 'Only authentic L\'Oreal Professionnel, O3+, Streax Professional, and Rica Italian waxes used.' },
        },
        {
            title: { type: String, default: 'Clinical UV Sterilization' },
            description: { type: String, default: 'Hospital-grade sanitization, sealed single-use kits, and disposable salon linens for maximum hygiene.' },
        },
        {
            title: { type: String, default: 'VIP Bridal & Groom Lounge' },
            description: { type: String, default: 'Private relaxing suites for peaceful pre-wedding transformations and pampering rituals.' },
        },
    ],
    footerNotice: { type: String, default: '© 2026 MAKEUP WITH ART. All Rights Reserved.' },
    whatsappConfig: {
        provider: { type: String, enum: ['META', 'WAAPI', 'WEB'], default: 'WEB' },
        apiToken: { type: String, default: '' },
        phoneNumberId: { type: String, default: '' },
    },
}, { timestamps: true });
exports.BusinessSettings = mongoose_1.default.model('BusinessSettings', BusinessSettingsSchema);
