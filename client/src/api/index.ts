import axios from 'axios';

let rawUrl = (import.meta as any).env?.VITE_API_URL || '/api';

// Auto-fix URL formatting so /api prefix is guaranteed
if (rawUrl.startsWith('http')) {
  const clean = rawUrl.replace(/\/$/, '');
  if (!clean.endsWith('/api')) {
    rawUrl = `${clean}/api`;
  } else {
    rawUrl = clean;
  }
}

const API_URL = rawUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mwa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional auto-logout handling
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Services API
export const serviceApi = {
  getAll: (params?: any) => api.get('/services', { params }),
  getBySlug: (slug: string) => api.get(`/services/${slug}`),
  create: (data: any) => api.post('/services', data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

// Packages API
export const packageApi = {
  getAll: (params?: any) => api.get('/packages', { params }),
  getBySlug: (slug: string) => api.get(`/packages/${slug}`),
  create: (data: any) => api.post('/packages', data),
  update: (id: string, data: any) => api.put(`/packages/${id}`, data),
  delete: (id: string) => api.delete(`/packages/${id}`),
};

// Bookings API
export const bookingApi = {
  getSlots: (date: string, duration?: number) => api.get('/bookings/slots', { params: { date, duration } }),
  create: (data: any) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancel: (id: string, cancellationReason?: string) => api.put(`/bookings/${id}/cancel`, { cancellationReason }),
  getAllAdmin: (params?: any) => api.get('/bookings/admin/all', { params }),
  updateStatusAdmin: (id: string, status: string, cancellationReason?: string, staffId?: string) =>
    api.put(`/bookings/admin/${id}/status`, { status, cancellationReason, staffId }),
};

// Admin API
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getSettingsPublic: () => api.get('/admin/settings/public'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
  getWorkingHours: () => api.get('/admin/working-hours'),
  updateWorkingHours: (hours: any[]) => api.put('/admin/working-hours', { hours }),
  getHolidays: () => api.get('/admin/holidays'),
  createHoliday: (data: any) => api.post('/admin/holidays', data),
  deleteHoliday: (id: string) => api.delete(`/admin/holidays/${id}`),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

// Users API
export const userApi = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  toggleStatus: (id: string) => api.put(`/users/${id}/toggle-status`),
};

// Staff API
export const staffApi = {
  getAllPublic: () => api.get('/staff'),
  getAllAdmin: () => api.get('/staff/admin'),
  create: (data: any) => api.post('/staff/admin', data),
  update: (id: string, data: any) => api.put(`/staff/admin/${id}`, data),
  delete: (id: string) => api.delete(`/staff/admin/${id}`),
};

// Gallery API
export const galleryApi = {
  getAll: (category?: string) => api.get('/gallery', { params: { category } }),
  create: (data: any) => api.post('/gallery', data),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

// Testimonials API
export const testimonialApi = {
  getAllPublic: () => api.get('/testimonials'),
  create: (data: any) => api.post('/testimonials', data),
  getAllAdmin: () => api.get('/testimonials/admin'),
  toggleStatus: (id: string) => api.put(`/testimonials/admin/${id}/status`),
  delete: (id: string) => api.delete(`/testimonials/admin/${id}`),
};

// Notifications API
export const notificationApi = {
  getMy: () => api.get('/notifications/me'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  broadcast: (data: any) => api.post('/notifications/broadcast', data),
};

// AI Image API
export const aiApi = {
  generateImage: (prompt: string, category: string) => api.post('/ai/generate-image', { prompt, category }),
};

// Contact API
export const contactApi = {
  submit: (data: any) => api.post('/contact', data),
  getAllAdmin: () => api.get('/contact/admin'),
  markRead: (id: string) => api.put(`/contact/admin/${id}/read`),
};
