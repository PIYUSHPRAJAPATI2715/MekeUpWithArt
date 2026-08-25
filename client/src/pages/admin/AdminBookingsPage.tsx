import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../api';
import { IBooking } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import { Search, Calendar, Filter, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getAllAdmin({
        status: statusFilter,
        date: dateFilter || undefined,
        search: search || undefined,
      });
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    let reason = '';
    if (newStatus === 'Cancelled') {
      reason = window.prompt('Enter cancellation reason (optional):') || 'Cancelled by admin';
    }

    try {
      const res = await bookingApi.updateStatusAdmin(id, newStatus, reason);
      if (res.data.success) {
        showToast(`Booking status updated to ${newStatus}. WhatsApp & Email notifications triggered!`, 'success');
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Appointment Bookings</h1>
          <p className="text-xs text-salon-muted">Manage customer appointments & status updates</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl glass-panel border border-salon-gold/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-Show'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                statusFilter === st
                  ? 'bg-salon-gold text-salon-dark shadow-md'
                  : 'bg-salon-dark/80 text-salon-cream/80 border border-salon-border hover:border-salon-gold'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
          />

          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search booking ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
            />
            <Search className="w-4 h-4 text-salon-muted absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl glass-panel border border-salon-gold/20 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-salon-dark/80 text-salon-gold uppercase font-bold text-[10px] tracking-wider border-b border-salon-border">
            <tr>
              <th className="p-4">Booking ID</th>
              <th className="p-4">Customer Info</th>
              <th className="p-4">Item</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-salon-border/40 text-salon-cream">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-salon-muted animate-pulse">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-salon-muted">
                  No appointments found matching your filters.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-salon-card/50 transition-colors">
                  <td className="p-4 font-bold text-salon-gold">{b.bookingId}</td>
                  <td className="p-4">
                    <p className="font-bold text-salon-cream">{b.customerName}</p>
                    <p className="text-[10px] text-salon-muted">{b.customerPhone}</p>
                    <p className="text-[10px] text-salon-muted">{b.customerEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{b.itemName}</p>
                    {b.variantName && <span className="text-[10px] text-salon-gold">({b.variantName})</span>}
                  </td>
                  <td className="p-4 font-medium">
                    <p>{b.date}</p>
                    <p className="text-[10px] text-salon-gold">{b.timeSlot} ({b.duration} mins)</p>
                  </td>
                  <td className="p-4 font-bold text-salon-gold">₹{b.price}</td>
                  <td className="p-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="p-4 text-right space-x-1">
                    {b.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'Confirmed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black font-bold text-[10px]"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'Completed')}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-black font-bold text-[10px]"
                      >
                        Complete
                      </button>
                    )}
                    {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white font-bold text-[10px]"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
