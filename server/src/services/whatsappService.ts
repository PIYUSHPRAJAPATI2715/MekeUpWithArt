import axios from 'axios';
import { config } from '../config/env';

export const sendWhatsAppMessage = async (
  recipientPhone: string,
  messageText: string
): Promise<{ success: boolean; message: string }> => {
  if (!config.WHATSAPP.ACCESS_TOKEN || !config.WHATSAPP.PHONE_NUMBER_ID) {
    console.log(`[WhatsApp Service - Info] Meta Cloud API credentials missing. Message suppressed for ${recipientPhone}:`);
    console.log(`[WhatsApp Message Body]:\n${messageText}`);
    return { success: false, message: 'WhatsApp Integration not configured (Credentials missing in environment variables).' };
  }

  try {
    const cleanPhone = recipientPhone.replace(/\D/g, '');
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
          Authorization: `Bearer ${config.WHATSAPP.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[WhatsApp Service] WhatsApp notification sent to ${recipientPhone}`);
    return { success: true, message: 'WhatsApp message sent successfully' };
  } catch (error: any) {
    console.error('[WhatsApp Service Error]:', error?.response?.data || error.message);
    return { success: false, message: `WhatsApp message failed: ${error.message}` };
  }
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
