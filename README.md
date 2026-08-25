# MAKEUP WITH ART - Premium Unisex Salon Platform

A complete, production-ready, full-stack website and admin control panel built for **MAKEUP WITH ART**, a luxury unisex salon located at *Pillar No. 113, Shyam Nagar Metro Station, Jaipur*.

---

## 🌟 Features Overview

### 💅 Customer Portal
- **Luxury Aesthetic**: Obsidian Charcoal theme with Champagne Gold accents, glassmorphic panels, Playfair Display & Plus Jakarta Sans typography.
- **Hero Landing Page**: Motion hero banner, About section, Dynamic Services grid, Dynamic Packages slider, Why Choose Us, Filterable Gallery, Customer Testimonials carousel, Instagram social feed, Google Maps studio location.
- **Services Menu**: Filter by Hair, Skin, Makeup, Nails, Eyelash; search & sort (price, popularity); tier variant selector (Basic, Premium, Luxury); service details page with instant booking.
- **Packages Menu**: Bundled pamper offers, inclusions breakdown, savings calculator, validity period, instant booking.
- **Atomic Booking Engine**: Interactive date picker, slot calculation based on working hours/breaks/holidays, preferred staff selector, auth protection guard, double-booking prevention, confirmation screen.
- **User Authentication**: JWT based login & registration, profile management, booking history tracking (Upcoming, Completed, Cancelled).
- **In-App & Multi-Channel Notifications**: Real-time web notification bell, Nodemailer SMTP email confirmation templates, Meta WhatsApp Cloud API integration.

### 🛡️ SaaS Admin Panel (`/admin/*`)
- **Dashboard Analytics**: Real-time KPI metric cards (Total Users, Total Bookings, Today's Bookings, Revenue, Pending/Confirmed/Completed/Cancelled count), line charts, quick action triggers.
- **Booking Management**: Multi-filter table, status transitions (Pending → Confirmed → Completed / Cancelled / No-Show) with automated WhatsApp & Email notification triggers and audit trail logging.
- **Service & Package Management**: Full CRUD, status toggling, tier pricing, and **DALL-E AI Image Generator** integration.
- **AI Image Generator**: Admin prompt interface ("Luxury bridal makeup with elegant Indian styling") -> DALL-E 3 API synthesis -> automatic image linking.
- **User Management**: View customer profiles, enable/disable accounts, inspect booking history.
- **Staff Management**: Roster control, photo, designation, assigned services, working shifts.
- **Gallery & Testimonials**: Filtered portfolio management, review approval & hiding.
- **Notification Broadcast Center**: Multi-channel dispatch (In-App, Email, WhatsApp) to targeted customer segments.
- **Business Control Panel**: Operating hours editor (Monday–Sunday opening/closing/break times), holiday calendar date blocker, contact numbers (8949009360, 7357496309), email, Instagram handle.
- **Security Audit Logs**: Track all administrative operations with admin email, timestamp, IP, entity ID.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Axios, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose, JWT, bcryptjs, Nodemailer, Axios, Multer, OpenAI DALL-E API.
- **Database**: MongoDB (Mongoose Schemas with proper indexing and atomic validation).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 2. Environment Setup
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
# Install root, server and client dependencies
cmd /c "cd server && npm install"
cmd /c "cd client && npm install"
```

### 4. Seed Database with Realistic Data
```bash
cmd /c "cd server && npm run seed"
```
*Seed script creates sample services, packages, staff, gallery items, testimonials, working hours, business settings, default customer, and default super admin.*

### 5. Default Credentials
- **Admin Email**: `admin@makeupwithart.com`
- **Admin Password**: `Admin@123456`
- **Customer Email**: `customer@gmail.com`
- **Customer Password**: `Customer@123456`

### 6. Start Development Servers
```bash
# Start Backend API (Port 5000)
cmd /c "cd server && npm run dev"

# Start Frontend Client (Port 5173)
cmd /c "cd client && npm run dev"
```

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate customer/admin | Public |
| `GET` | `/api/auth/me` | Fetch current session profile | Authenticated |
| `GET` | `/api/services` | Get all active services | Public |
| `GET` | `/api/services/:slug` | Get single service details | Public |
| `POST` | `/api/services` | Create new service | Admin |
| `PUT` | `/api/services/:id` | Update service | Admin |
| `DELETE` | `/api/services/:id` | Delete service | Admin |
| `GET` | `/api/packages` | Get all active packages | Public |
| `POST` | `/api/packages` | Create new package | Admin |
| `GET` | `/api/bookings/slots` | Calculate available time slots for date | Public |
| `POST` | `/api/bookings` | Book appointment | Authenticated |
| `GET` | `/api/bookings/my-bookings` | Customer booking history | Customer |
| `GET` | `/api/bookings/admin/all` | Admin all bookings view | Admin |
| `PUT` | `/api/bookings/admin/:id/status` | Update booking status | Admin |
| `POST` | `/api/ai/generate-image` | DALL-E AI Image Generator | Admin |
| `POST` | `/api/notifications/broadcast` | Broadcast notifications | Admin |

---

## 🌐 Production Deployment

- **Frontend**: Deploy `/client` to Vercel or Netlify. Set `VITE_API_URL`.
- **Backend**: Deploy `/server` to Render, Railway, or AWS. Set environment variables in platform dashboard.
- **Database**: MongoDB Atlas Cluster.
