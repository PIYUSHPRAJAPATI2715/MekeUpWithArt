import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { bookingApi, authApi, notificationApi } from '../../api';
import { IBooking, INotification } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import {
  User as UserIcon,
  Calendar,
  Bell,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'notifications'>('profile');

  // Bookings state
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [bookingFilter, setBookingFilter] = useState<string>('All');

  // Profile Edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'bookings') setActiveTab('bookings');
    if (tabParam === 'notifications') setActiveTab('notifications');
  }, [location.search]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  // Load Bookings
  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await bookingApi.getMyBookings();
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadBookings();
    notificationApi.getMy().then((res) => {
      if (res.data.success) setNotifications(res.data.data);
    });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await authApi.updateProfile({ name, phone });
      if (res.data.success) {
        showToast('Profile updated successfully', 'success');
        refreshUser();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment booking?')) return;
    try {
      const res = await bookingApi.cancel(id, 'Cancelled by customer');
      if (res.data.success) {
        showToast('Booking cancelled successfully', 'info');
        loadBookings();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel booking', 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'Upcoming') return b.status === 'Pending' || b.status === 'Confirmed';
    if (bookingFilter === 'Completed') return b.status === 'Completed';
    if (bookingFilter === 'Cancelled') return b.status === 'Cancelled' || b.status === 'No-Show';
    return true;
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-salon-gold/25 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=D4AF37&color=0B0B0E`
            }
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-salon-gold shadow-xl"
          />
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-salon-cream">{user?.name}</h1>
            <p className="text-xs text-salon-muted flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-salon-gold" />
              {user?.email}
            </p>
            <p className="text-xs text-salon-muted flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-salon-gold" />
              {user?.phone}
            </p>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-2 bg-salon-dark/80 p-1.5 rounded-2xl border border-salon-border">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-salon-gold text-salon-dark shadow-md'
                : 'text-salon-cream/80 hover:text-salon-gold'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Profile Details
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-salon-gold text-salon-dark shadow-md'
                : 'text-salon-cream/80 hover:text-salon-gold'
            }`}
          >
            <Calendar className="w-4 h-4" />
            My Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'notifications'
                ? 'bg-salon-gold text-salon-dark shadow-md'
                : 'text-salon-cream/80 hover:text-salon-gold'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl glass-panel border border-salon-gold/20 space-y-6">
          <h3 className="font-serif text-xl font-bold text-salon-cream">Edit Account Profile</h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                Email Address (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 rounded-xl bg-salon-dark/40 border border-salon-border/40 text-salon-muted text-xs cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-3 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold shadow-lg hover:scale-105 transition-transform"
            >
              {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Booking Filters */}
          <div className="flex items-center gap-2 border-b border-salon-border pb-4">
            {['All', 'Upcoming', 'Completed', 'Cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setBookingFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  bookingFilter === f
                    ? 'bg-salon-gold text-salon-dark'
                    : 'bg-salon-card text-salon-cream/80 hover:text-salon-gold border border-salon-border'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loadingBookings ? (
            <div className="py-12 text-center text-xs text-salon-muted animate-pulse">
              Loading your bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center text-xs text-salon-muted space-y-2">
              <Calendar className="w-10 h-10 text-salon-muted mx-auto" />
              <p>No bookings found for filter '{bookingFilter}'.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-6 rounded-2xl glass-panel border border-salon-gold/20 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-salon-border/60 pb-3">
                      <span className="font-bold text-salon-gold text-xs">{b.bookingId}</span>
                      <StatusBadge status={b.status} />
                    </div>

                    <div>
                      <h4 className="font-serif text-lg font-bold text-salon-cream">{b.itemName}</h4>
                      {b.variantName && (
                        <span className="text-[11px] text-salon-gold">Tier: {b.variantName}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-salon-muted pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-salon-gold" />
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-salon-gold" />
                        <span>{b.timeSlot} ({b.duration} mins)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-salon-muted">Total Amount:</span>
                      <span className="text-lg font-extrabold text-gold-gradient">₹{b.price}</span>
                    </div>

                    {b.notes && (
                      <p className="text-[11px] text-salon-muted italic bg-salon-dark/40 p-2 rounded-lg">
                        Note: {b.notes}
                      </p>
                    )}
                  </div>

                  {(b.status === 'Pending' || b.status === 'Confirmed') && (
                    <div className="pt-3 border-t border-salon-border flex justify-end">
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="font-serif text-xl font-bold text-salon-cream">Notification History</h3>
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-salon-muted">No notifications found.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className="p-4 rounded-2xl glass-panel border border-salon-border flex items-start gap-4 text-xs"
              >
                <Bell className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-salon-cream text-sm">{n.title}</p>
                    <span className="text-[10px] text-salon-muted">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-salon-cream/80">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
