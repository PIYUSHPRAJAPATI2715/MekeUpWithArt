"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBookingWhatsAppText = exports.sendWhatsAppMessage = exports.initWhatsAppWeb = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
// whatsapp-web.js types & optional import
let whatsappWebClient = null;
let isWhatsAppWebReady = false;
const initWhatsAppWeb = () => {
    try {
        // Dynamic import to prevent crash if puppeteer environment is restricted
        const { Client, LocalAuth } = require('whatsapp-web.js');
        const qrcode = require('qrcode-terminal');
        console.log('[WhatsApp Web] Initializing WhatsApp Web QR client...');
        whatsappWebClient = new Client({
            authStrategy: new LocalAuth({ dataPath: './whatsapp-session' }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            },
        });
        whatsappWebClient.on('qr', (qr) => {
            console.log('\n==================================================');
            console.log(' [WhatsApp Web] SCAN THIS QR CODE WITH YOUR PHONE:');
            console.log('==================================================\n');
            qrcode.generate(qr, { small: true });
        });
        whatsappWebClient.on('ready', () => {
            isWhatsAppWebReady = true;
            console.log('\n==================================================');
            console.log(' 🎉 [WhatsApp Web] Client connected and ready!');
            console.log('==================================================\n');
        });
        whatsappWebClient.on('authenticated', () => {
            console.log(' [WhatsApp Web] Session authenticated successfully.');
        });
        whatsappWebClient.on('auth_failure', (msg) => {
            console.error(' [WhatsApp Web Auth Error]:', msg);
        });
        whatsappWebClient.initialize().catch((err) => {
            console.log('[WhatsApp Web Info] Initialization deferred (Headless browser not active):', err.message);
        });
    }
    catch (err) {
        console.log('[WhatsApp Web Info] whatsapp-web.js module load notice:', err.message);
    }
};
exports.initWhatsAppWeb = initWhatsAppWeb;
const sendWhatsAppMessage = async (recipientPhone, messageText) => {
    // Clean phone number (e.g. 918949009360)
    let cleanPhone = recipientPhone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
    }
    // 1. Primary Attempt: whatsapp-web.js (100% FREE Linked Phone Session)
    if (isWhatsAppWebReady && whatsappWebClient) {
        try {
            const chatId = `${cleanPhone}@c.us`;
            await whatsappWebClient.sendMessage(chatId, messageText);
            console.log(`[WhatsApp Web JS] Message successfully sent to ${cleanPhone}`);
            return { success: true, message: 'Message sent via whatsapp-web.js linked phone' };
        }
        catch (wwebErr) {
            console.warn('[WhatsApp Web JS Error]:', wwebErr.message);
        }
    }
    // 2. Secondary Attempt: WaAPI HTTP Integration
    const token = process.env.WAAPI_API_TOKEN || env_1.config.WHATSAPP.ACCESS_TOKEN;
    if (token) {
        try {
            const instancesRes = await axios_1.default.get('https://waapi.app/api/v1/instances', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const instances = instancesRes.data?.data || instancesRes.data;
            if (Array.isArray(instances) && instances.length > 0) {
                const instanceId = instances[0].id;
                const sendUrl = `https://waapi.app/api/v1/instances/${instanceId}/client/action/send-message`;
                await axios_1.default.post(sendUrl, {
                    chatId: `${cleanPhone}@c.us`,
                    message: messageText,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`[WhatsApp Service - WaAPI] Message sent to ${cleanPhone}`);
                return { success: true, message: 'Message sent via WaAPI' };
            }
        }
        catch (waApiErr) {
            console.warn('[WhatsApp Service] WaAPI notice:', waApiErr?.response?.data?.message || waApiErr.message);
        }
    }
    // 3. Tertiary Attempt: Meta Cloud API
    if (env_1.config.WHATSAPP.PHONE_NUMBER_ID && token) {
        try {
            const url = `${env_1.config.WHATSAPP.API_URL}/${env_1.config.WHATSAPP.PHONE_NUMBER_ID}/messages`;
            await axios_1.default.post(url, {
                messaging_product: 'whatsapp',
                to: cleanPhone,
                type: 'text',
                text: { body: messageText },
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`[WhatsApp Service - Meta] Message sent to ${cleanPhone}`);
            return { success: true, message: 'Message sent via Meta Cloud API' };
        }
        catch (metaErr) {
            console.error('[WhatsApp Service Error]:', metaErr?.response?.data || metaErr.message);
        }
    }
    console.log(`[WhatsApp Service - Log] Suppressed message for ${recipientPhone}:\n${messageText}`);
    return { success: false, message: 'WhatsApp message logged (Scan QR code in server logs to enable live phone dispatch)' };
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
const formatBookingWhatsAppText = (booking, eventType) => {
    if (eventType === 'CREATED') {
        return `Hello ${booking.customerName},\n\nYour appointment request with MAKEUP WITH ART has been received.\n\n📌 Booking ID: ${booking.bookingId}\n💅 Service: ${booking.itemName}\n📅 Date: ${booking.date}\n⏰ Time: ${booking.timeSlot}\n💰 Amount: ₹${booking.price}\n\nWe look forward to seeing you at Pillar No. 113, Shyam Nagar Metro Station.\n\nMAKEUP WITH ART\nPhone: 8949009360 / 7357496309`;
    }
    if (eventType === 'CONFIRMED') {
        return `Hello ${booking.customerName},\n\nGreat news! Your appointment (${booking.bookingId}) for ${booking.itemName} on ${booking.date} at ${booking.timeSlot} has been CONFIRMED by our team.\n\nSee you soon at MAKEUP WITH ART!`;
    }
    if (eventType === 'CANCELLED') {
        return `Hello ${booking.customerName},\n\nYour appointment (${booking.bookingId}) for ${booking.itemName} on ${booking.date} has been CANCELLED.\nReason: ${booking.cancellationReason || 'Requested by customer/admin'}.\n\nPlease contact us at 8949009360 for re-booking.`;
    }
    return `Hello ${booking.customerName},\n\nYour appointment details have been updated.\nBooking ID: ${booking.bookingId}\nDate: ${booking.date}\nTime: ${booking.timeSlot}`;
};
exports.formatBookingWhatsAppText = formatBookingWhatsAppText;
