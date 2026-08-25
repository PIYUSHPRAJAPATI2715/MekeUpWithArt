import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ServicesPage } from './pages/customer/ServicesPage';
import { ServiceDetailPage } from './pages/customer/ServiceDetailPage';
import { PackagesPage } from './pages/customer/PackagesPage';
import { PackageDetailPage } from './pages/customer/PackageDetailPage';
import { LoginPage } from './pages/customer/LoginPage';
import { SignupPage } from './pages/customer/SignupPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { ContactPage } from './pages/customer/ContactPage';
import { AboutPage } from './pages/customer/AboutPage';
import { GalleryPage } from './pages/customer/GalleryPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminPackagesPage } from './pages/admin/AdminPackagesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminStaffPage } from './pages/admin/AdminStaffPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Customer Website Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetailPage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="packages/:slug" element={<PackageDetailPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="packages" element={<AdminPackagesPage />} />
        <Route path="customers" element={<AdminUsersPage />} />
        <Route path="staff" element={<AdminStaffPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="testimonials" element={<AdminTestimonialsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="working-hours" element={<AdminSettingsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
