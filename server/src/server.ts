import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { initWhatsAppWeb } from './services/whatsappService';

// Import Routes
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import packageRoutes from './routes/packageRoutes';
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import staffRoutes from './routes/staffRoutes';
import galleryRoutes from './routes/galleryRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import notificationRoutes from './routes/notificationRoutes';
import aiRoutes from './routes/aiRoutes';
import contactRoutes from './routes/contactRoutes';

const app = express();

// Connect Database
connectDB();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: [config.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    business: 'MAKEUP WITH ART',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Start Server & Init WhatsApp Web Client
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`  MAKEUP WITH ART - Backend Server Active`);
  console.log(`  Environment: ${config.NODE_ENV}`);
  console.log(`  Listening on: http://localhost:${PORT}`);
  console.log(`==================================================\n`);

  // Initialize whatsapp-web.js QR Scanner
  initWhatsAppWeb();
});
