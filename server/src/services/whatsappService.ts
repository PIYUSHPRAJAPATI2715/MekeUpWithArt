import axios from 'axios';
import { config } from '../config/env';

export const sendWhatsAppMessage = async (
  recipientPhone: string,
  messageText: string
): Promise<{ success: boolean; message: string }> => {
  const token = process.env.WAAPI_API_TOKEN || config.WHATSAPP.ACCESS_TOKEN;

  if (!token) {
    console.log(`[WhatsApp Service - Info] WhatsApp API token missing. Message suppressed for ${recipientPhone}:`);
    console.log(`[WhatsApp Message Body]:\n${messageText}`);
    return { success: false, message: 'WhatsApp Integration not configured (Credentials missing in environment variables).' };
  }

  // Clean phone number (e.g. 918949009360)
  let cleanPhone = recipientPhone.replace(/\D/g, '');
  if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }

  // Try WaAPI (if token matches WaAPI format or fallback)
  try {
    // 1. Fetch active WaAPI instance ID automatically
    const instancesRes = await axios.get('https://waapi.app/api/v1/instances', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const instances = instancesRes.data?.data || instancesRes.data;
    if (Array.isArray(instances) && instances.length > 0) {
      const instanceId = instances[0].id;
      const sendUrl = `https://waapi.app/api/v1/instances/${instanceId}/client/action/send-message`;

      await axios.post(
        sendUrl,
        {
          chatId: `${cleanPhone}@c.us`,
          message: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`[WhatsApp Service - WaAPI] WhatsApp message successfully sent to ${cleanPhone}`);
      return { success: true, message: 'WhatsApp message sent via WaAPI' };
    }
  } catch (waApiErr: any) {
    console.warn('[WhatsApp Service] WaAPI attempt notice:', waApiErr?.response?.data?.message || waApiErr.message);
  }

  // Fallback to Meta Cloud API
  if (config.WHATSAPP.PHONE_NUMBER_ID) {
    try {
      const url = `${config.WHATSAPP.API_URL}/${config.WHATSAPP.PHONE_NUMBER_ID}/messages`;
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: { body: messageText },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`[WhatsApp Service - Meta] WhatsApp message sent to ${cleanPhone}`);
      return { success: true, message: 'WhatsApp message sent via Meta Cloud API' };
    } catch (metaErr: any) {
      console.error('[WhatsApp Service Error]:', metaErr?.response?.data || metaErr.message);
      return { success: false, message: `WhatsApp message failed: ${metaErr.message}` };
    }
  }

  return { success: false, message: 'WhatsApp dispatch completed with fallback' };
};

export const formatBookingWhatsAppText = (booking: any, eventType: 'CREATED' | 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED') => {
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
