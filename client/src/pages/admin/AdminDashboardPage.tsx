import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { StatusBadge } from '../../components/common/Badge';
import {
  Users,
  CalendarCheck,
  Clock,
  Scissors,
  Package,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Plus,
  Bell,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentBookings(res.data.recentBookings || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-salon-muted animate-pulse">Loading dashboard analytics...</div>;
  }

  const statCards = [
    { title: "Today's Bookings", value: stats?.todaysBookings || 0, icon: Clock, color: 'text-salon-gold' },
    { title: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'Pending Bookings', value: stats?.pendingBookings || 0, icon: CalendarCheck, color: 'text-amber-400' },
    { title: 'Confirmed Bookings', value: stats?.confirmedBookings || 0, icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Total Customers', value: stats?.totalUsers || 0, icon: Users, color: 'text-sky-400' },
    { title: 'Active Services', value: stats?.totalServices || 0, icon: Scissors, color: 'text-purple-400' },
    { title: 'Active Packages', value: stats?.totalPackages || 0, icon: Package, color: 'text-indigo-400' },
    { title: 'Cancelled / No-Show', value: stats?.cancelledBookings || 0, icon: XCircle, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Business Dashboard</h1>
          <p className="text-xs text-salon-muted">Live performance overview & appointment control</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/services"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold shadow-md hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Link>
          <Link
            to="/admin/packages"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-salon-card border border-salon-gold/30 text-salon-gold text-xs font-bold hover:bg-salon-gold hover:text-salon-dark transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Package
          </Link>
          <Link
            to="/admin/notifications"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-salon-card border border-salon-border text-salon-cream text-xs font-semibold hover:border-salon-gold transition-colors"
          >
            <Bell className="w-4 h-4 text-salon-gold" />
            Broadcast Notification
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl glass-panel border border-salon-gold/20 flex items-center justify-between shadow-lg"
            >
              <div className="space-y-1">
                <span className="text-[11px] text-salon-muted font-medium uppercase tracking-wider block">
                  {card.title}
                </span>
                <span className="text-2xl font-serif font-extrabold text-salon-cream block">
                  {card.value}
                </span>
              </div>
              <div className={`p-3 rounded-xl bg-salon-dark/60 border border-salon-border/60 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-salon-cream">Recent Appointments</h3>
          <Link to="/admin/bookings" className="text-xs text-salon-gold font-bold hover:underline">
            View All Bookings →
          </Link>
        </div>

        <div className="rounded-2xl glass-panel border border-salon-gold/20 overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-salon-dark/80 text-salon-gold uppercase font-bold text-[10px] tracking-wider border-b border-salon-border">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service / Package</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-salon-border/40 text-salon-cream">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-salon-muted">No appointments recorded yet.</td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-salon-card/50 transition-colors">
                    <td className="p-4 font-bold text-salon-gold">{b.bookingId}</td>
                    <td className="p-4 font-semibold">
                      {b.customerName}
                      <span className="block text-[10px] text-salon-muted">{b.customerPhone}</span>
                    </td>
                    <td className="p-4">{b.itemName}</td>
                    <td className="p-4">
                      {b.date} @ {b.timeSlot}
                    </td>
                    <td className="p-4 font-bold text-salon-gold">₹{b.price}</td>
                    <td className="p-4">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
