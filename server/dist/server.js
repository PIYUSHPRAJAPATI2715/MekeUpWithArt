"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const errorHandler_1 = require("./middlewares/errorHandler");
const whatsappService_1 = require("./services/whatsappService");
const seed_1 = require("./utils/seed");
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/packageRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const staffRoutes_1 = __importDefault(require("./routes/staffRoutes"));
const galleryRoutes_1 = __importDefault(require("./routes/galleryRoutes"));
const testimonialRoutes_1 = __importDefault(require("./routes/testimonialRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const app = (0, express_1.default)();
// Connect Database
(0, db_1.connectDB)();
// 1. CORS Middleware Configuration
const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
// 2. Additional Headers Fallback Middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, Origin');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
// Security Middlewares
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false }));
// Rate Limiter
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);
// Body Parser
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static uploads folder
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        business: 'MAKEUP WITH ART',
        timestamp: new Date().toISOString(),
    });
});
// Seed Endpoint (Available at both /seed and /api/seed)
const handleSeed = async (req, res) => {
    try {
        await (0, seed_1.seedDatabaseData)();
        res.json({
            success: true,
            message: 'MongoDB Atlas populated with admin (admin@makeupwithart.com / Admin@123456), services, packages, and gallery items!',
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
app.get('/seed', handleSeed);
app.get('/api/seed', handleSeed);
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/packages', packageRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/staff', staffRoutes_1.default);
app.use('/api/gallery', galleryRoutes_1.default);
app.use('/api/testimonials', testimonialRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
// Centralized Error Handler
app.use(errorHandler_1.errorHandler);
// Start Server & Init WhatsApp Web Client
const PORT = env_1.config.PORT;
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`  MAKEUP WITH ART - Backend Server Active`);
    console.log(`  Environment: ${env_1.config.NODE_ENV}`);
    console.log(`  Listening on: http://localhost:${PORT}`);
    console.log(`==================================================\n`);
    // Initialize whatsapp-web.js QR Scanner
    (0, whatsappService_1.initWhatsAppWeb)();
});
