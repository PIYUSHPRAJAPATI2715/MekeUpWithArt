"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBookingWhatsAppText = exports.sendWhatsAppMessage = exports.getWhatsAppConnectionStatus = exports.initWhatsAppWeb = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const BusinessSettings_1 = require("../models/BusinessSettings");
// whatsapp-web.js types & optional import
let whatsappWebClient = null;
let isWhatsAppWebReady = false;
const initWhatsAppWeb = () => {
    try {
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
            console.log('[WhatsApp Web Info] Initialization deferred:', err.message);
        });
    }
    catch (err) {
        console.log('[WhatsApp Web Info] whatsapp-web.js module load notice:', err.message);
    }
};
exports.initWhatsAppWeb = initWhatsAppWeb;
const getWhatsAppConnectionStatus = () => {
    return {
        isWebReady: isWhatsAppWebReady,
        hasMetaConfigured: Boolean(process.env.WHATSAPP_TOKEN || env_1.config.WHATSAPP.ACCESS_TOKEN),
        hasWaapiConfigured: Boolean(process.env.WAAPI_API_TOKEN),
    };
};
exports.getWhatsAppConnectionStatus = getWhatsAppConnectionStatus;
/**
 * Universal WhatsApp Sender supporting text + optional image
 */
const sendWhatsAppMessage = async (recipientPhone, messageText, imageUrl) => {
    // Clean phone number (e.g. 919352769045)
    let cleanPhone = recipientPhone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
    }
    // Check DB settings for custom WhatsApp config
    let dbSettings = null;
    try {
        dbSettings = await BusinessSettings_1.BusinessSettings.findOne().lean();
    }
    catch (e) {
        // proceed with env fallback
    }
    const customConfig = dbSettings?.whatsappConfig || {};
    const provider = customConfig.provider || 'WEB';
    const apiToken = customConfig.apiToken || process.env.WAAPI_API_TOKEN || env_1.config.WHATSAPP.ACCESS_TOKEN;
    const phoneNumberId = customConfig.phoneNumberId || env_1.config.WHATSAPP.PHONE_NUMBER_ID;
    // 1. Attempt WhatsApp Web (Local Auth Client)
    if (isWhatsAppWebReady && whatsappWebClient) {
        try {
            const chatId = `${cleanPhone}@c.us`;
            if (imageUrl) {
                try {
                    const { MessageMedia } = require('whatsapp-web.js');
                    const media = await MessageMedia.fromUrl(imageUrl);
                    await whatsappWebClient.sendMessage(chatId, media, { caption: messageText });
                    return { success: true, message: 'Sent image + caption via WhatsApp Web', provider: 'whatsapp-web.js' };
                }
                catch (mediaErr) {
                    console.warn('[WhatsApp Web Media Failed, falling back to text]:', mediaErr.message);
                }
            }
            await whatsappWebClient.sendMessage(chatId, messageText);
            return { success: true, message: 'Message sent via WhatsApp Web', provider: 'whatsapp-web.js' };
        }
        catch (wwebErr) {
            console.warn('[WhatsApp Web JS Error]:', wwebErr.message);
        }
    }
    // 2. Attempt WaAPI (if token provided)
    if (apiToken && (provider === 'WAAPI' || !phoneNumberId)) {
        try {
            const instancesRes = await axios_1.default.get('https://waapi.app/api/v1/instances', {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    Accept: 'application/json',
                },
            });
            const instances = instancesRes.data?.data || instancesRes.data;
            if (Array.isArray(instances) && instances.length > 0) {
                const instanceId = instances[0].id;
                if (imageUrl) {
                    const mediaUrl = `https://waapi.app/api/v1/instances/${instanceId}/client/action/send-media`;
                    await axios_1.default.post(mediaUrl, {
                        chatId: `${cleanPhone}@c.us`,
                        mediaUrl: imageUrl,
                        mediaCaption: messageText,
                    }, {
                        headers: {
                            Authorization: `Bearer ${apiToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    return { success: true, message: 'Sent image + caption via WaAPI', provider: 'WaAPI' };
                }
                else {
                    const sendUrl = `https://waapi.app/api/v1/instances/${instanceId}/client/action/send-message`;
                    await axios_1.default.post(sendUrl, {
                        chatId: `${cleanPhone}@c.us`,
                        message: messageText,
                    }, {
                        headers: {
                            Authorization: `Bearer ${apiToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    return { success: true, message: 'Message sent via WaAPI', provider: 'WaAPI' };
                }
            }
        }
        catch (waApiErr) {
            console.warn('[WhatsApp Service WaAPI notice]:', waApiErr?.response?.data?.message || waApiErr.message);
        }
    }
    // 3. Attempt Meta Cloud API (if configured)
    if (phoneNumberId && apiToken) {
        try {
            const url = `${env_1.config.WHATSAPP.API_URL}/${phoneNumberId}/messages`;
            if (imageUrl) {
                await axios_1.default.post(url, {
                    messaging_product: 'whatsapp',
                    to: cleanPhone,
                    type: 'image',
                    image: { link: imageUrl, caption: messageText },
                }, {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                return { success: true, message: 'Sent image + caption via Meta Cloud API', provider: 'Meta' };
            }
            else {
                await axios_1.default.post(url, {
                    messaging_product: 'whatsapp',
                    to: cleanPhone,
                    type: 'text',
                    text: { body: messageText },
                }, {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                return { success: true, message: 'Sent via Meta Cloud API', provider: 'Meta' };
            }
        }
        catch (metaErr) {
            console.error('[WhatsApp Service Meta Error]:', metaErr?.response?.data || metaErr.message);
        }
    }
    // 4. Log simulation / Fallback
    console.log(`[WhatsApp Broadcast / Log] Message queued for ${recipientPhone}:\n${messageText}${imageUrl ? `\n[Image: ${imageUrl}]` : ''}`);
    return {
        success: true,
        message: 'Broadcast logged (Connect Meta Cloud API or WaAPI Token in Admin Settings to enable automated gateway dispatch)',
        provider: 'Simulated / Logged',
    };
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
const formatBookingWhatsAppText = (booking, eventType) => {
    if (eventType === 'CREATED') {
        return `Hello ${booking.customerName},\n\nYour appointment request with MAKEUP WITH ART has been received! ✨\n\n📌 Booking ID: ${booking.bookingId}\n💅 Service: ${booking.itemName}\n📅 Date: ${booking.date}\n⏰ Time: ${booking.timeSlot}\n💰 Amount: ₹${booking.price}\n\nWe look forward to seeing you at Pillar No. 113, Shyam Nagar Metro Station, Jaipur.\n\nMAKEUP WITH ART Studio\n📞 Call/WhatsApp: 9352769045 / 7575939735`;
    }
    if (eventType === 'CONFIRMED') {
        return `Hello ${booking.customerName},\n\nGreat news! Your appointment (${booking.bookingId}) for ${booking.itemName} on ${booking.date} at ${booking.timeSlot} has been CONFIRMED by our Master Art Director.\n\n📍 Location: Pillar No. 113, Shyam Nagar Metro Station, Jaipur\nSee you soon at MAKEUP WITH ART!`;
    }
    if (eventType === 'CANCELLED') {
        return `Hello ${booking.customerName},\n\nYour appointment (${booking.bookingId}) for ${booking.itemName} on ${booking.date} has been CANCELLED.\nReason: ${booking.cancellationReason || 'Requested by customer/admin'}.\n\nPlease contact us at 9352769045 for re-booking or inquiries.`;
    }
    return `Hello ${booking.customerName},\n\nYour appointment details have been updated.\nBooking ID: ${booking.bookingId}\nDate: ${booking.date}\nTime: ${booking.timeSlot}\nPhone: 9352769045`;
};
exports.formatBookingWhatsAppText = formatBookingWhatsAppText;
