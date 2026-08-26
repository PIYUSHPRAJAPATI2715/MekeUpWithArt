"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingConfirmationEmailTemplate = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const sendEmail = async (to, subject, html) => {
    if (!env_1.config.SMTP.USER || !env_1.config.SMTP.PASS) {
        console.log(`[Email Service - Info] SMTP credentials not configured. Email suppressed to: ${to}`);
        return { success: false, message: 'Email Integration not configured (SMTP credentials missing).' };
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: env_1.config.SMTP.HOST,
            port: env_1.config.SMTP.PORT,
            secure: env_1.config.SMTP.PORT === 465,
            auth: {
                user: env_1.config.SMTP.USER,
                pass: env_1.config.SMTP.PASS,
            },
        });
        await transporter.sendMail({
            from: env_1.config.SMTP.FROM,
            to,
            subject,
            html,
        });
        console.log(`[Email Service] Email successfully sent to ${to}`);
        return { success: true, message: 'Email sent successfully' };
    }
    catch (error) {
        console.error(`[Email Service Error] Failed to send email:`, error.message);
        return { success: false, message: `Email sending failed: ${error.message}` };
    }
};
exports.sendEmail = sendEmail;
const getBookingConfirmationEmailTemplate = (booking) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color: #0b0b0e; color: #f9f6f0; padding: 30px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px; letter-spacing: 2px;">MAKEUP WITH ART</h1>
        <p style="color: #99958f; margin-top: 5px; font-size: 14px;">PREMIUM UNISEX SALON</p>
      </div>
      
      <div style="background-color: #141419; padding: 20px; border: 1px solid #2a2a32; border-radius: 6px; margin-bottom: 20px;">
        <h2 style="color: #f9f6f0; font-size: 18px; margin-top: 0;">Appointment Confirmation</h2>
        <p>Dear <strong>${booking.customerName}</strong>,</p>
        <p>Your appointment has been successfully received. Here are your booking details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #99958f;">Booking ID:</td>
            <td style="padding: 8px 0; color: #d4af37; font-weight: bold; text-align: right;">${booking.bookingId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #99958f;">Service / Package:</td>
            <td style="padding: 8px 0; color: #f9f6f0; text-align: right;">${booking.itemName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #99958f;">Date:</td>
            <td style="padding: 8px 0; color: #f9f6f0; text-align: right;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #99958f;">Time Slot:</td>
            <td style="padding: 8px 0; color: #f9f6f0; text-align: right;">${booking.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #99958f;">Amount:</td>
            <td style="padding: 8px 0; color: #d4af37; font-weight: bold; text-align: right;">₹${booking.price}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #99958f;">Status:</td>
            <td style="padding: 8px 0; color: #4ade80; text-align: right; font-weight: bold;">${booking.status}</td>
          </tr>
        </table>
      </div>

      <div style="font-size: 12px; color: #99958f; text-align: center;">
        <p>Address: Pillar No. 113, Shyam Nagar Metro Station, Jaipur</p>
        <p>Contact: +91 8949009360 | +91 7357496309</p>
      </div>
    </div>
  `;
};
exports.getBookingConfirmationEmailTemplate = getBookingConfirmationEmailTemplate;
