import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to default .env in server folder

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/makeupwithart',
  JWT_SECRET: process.env.JWT_SECRET || 'makeup_with_art_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: Number(process.env.SMTP_PORT) || 587,
    USER: process.env.SMTP_USER || '',
    PASS: process.env.SMTP_PASSWORD || '',
    FROM: process.env.EMAIL_FROM || '"MAKEUP WITH ART" <makeupwitharto@gmail.com>',
  },
  WHATSAPP: {
    API_URL: process.env.WHATSAPP_API_URL || '',
    ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || '',
    PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    API_KEY: process.env.CLOUDINARY_API_KEY || '',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  }
};
