import React, { useState, useEffect } from 'react';
import { bookingApi, serviceApi, packageApi, staffApi, userApi } from '../../api';
import { IBooking, IService, IPackage, IStaff, IUser } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import {
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Plus,
  MessageCircle,
  Phone,
  RefreshCw,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Manual Booking Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [services, setServices] = useState<IService[]>([]);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [customers, setCustomers] = useState<IUser[]>([]);

  const [itemType, setItemType] = useState<'service' | 'package'>('service');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM');
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [notes, setNotes] = useState<string>('Walk-in / Phone appointment booked by Admin');
  const [status, setStatus] = useState<'Confirmed' | 'Pending'>('Confirmed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultSlots = [
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
    '08:30 PM', '09:00 PM'
  ];

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
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  // Load supporting catalog data for modal
  useEffect(() => {
    Promise.allSettled([
      serviceApi.getAll({ limit: 100 }),
      packageApi.getAll(),
      staffApi.getAllAdmin(),
      userApi.getAll({ limit: 100 }),
    ]).then(([sRes, pRes, stRes, uRes]) => {
      if (sRes.status === 'fulfilled' && sRes.value.data.success) {
        const sList = sRes.value.data.data;
        setServices(sList);
        if (sList.length > 0 && !selectedItemId) {
          setSelectedItemId(sList[0]._id);
          setPrice(String(sList[0].discountPrice || sList[0].price));
        }
      }
      if (pRes.status === 'fulfilled' && pRes.value.data.success) {
        setPackages(pRes.value.data.data);
      }
      if (stRes.status === 'fulfilled' && stRes.value.data.success) {
        setStaffList(stRes.value.data.data);
      }
      if (uRes.status === 'fulfilled' && uRes.value.data.success) {
        setCustomers(uRes.value.data.data);
      }
    });
  }, []);

  // Fetch slots whenever date changes
  useEffect(() => {
    if (date) {
      bookingApi.getSlots(date)
        .then((res) => {
          if (res.data.success && res.data.slots) {
            setAvailableSlots(res.data.slots);
          }
        })
        .catch(() => setAvailableSlots([]));
    }
  }, [date]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleItemSelectChange = (newType: 'service' | 'package', newId: string) => {
    setItemType(newType);
    setSelectedItemId(newId);
    if (newType === 'service') {
      const found = services.find((s) => s._id === newId);
      if (found) setPrice(String(found.discountPrice || found.price));
    } else {
      const found = packages.find((p) => p._id === newId);
      if (found) setPrice(String(found.discountPrice || found.originalPrice));
    }
  };

  const handleExistingCustomerSelect = (userId: string) => {
    if (!userId) return;
    const found = customers.find((c: any) => c._id === userId);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerEmail(found.email);
    }
  };

  const handleCreateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !date || !timeSlot || !customerName.trim() || !customerPhone.trim()) {
      showToast('Please fill in Customer Name, Phone, Service, Date, and Time', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      try {
        res = await bookingApi.createAdmin({
          itemType,
          itemId: selectedItemId,
          date,
          timeSlot,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          price: price ? Number(price) : undefined,
          staff: selectedStaffId || undefined,
          notes: notes.trim(),
          status,
        });
      } catch (err: any) {
        // Fallback to standard bookingApi.create if admin route is still deploying
        if (err.response?.status === 404) {
          const cleanPhone = customerPhone.replace(/\D/g, '');
          res = await bookingApi.create({
            itemType,
            itemId: selectedItemId,
            date,
            timeSlot,
            customerName: customerName.trim(),
            customerPhone: cleanPhone,
            customerEmail: customerEmail.trim() || `client_${cleanPhone}@makeupwithart.local`,
            staff: selectedStaffId || undefined,
            notes: notes.trim(),
          });
        } else {
          throw err;
        }
      }

      if (res?.data?.success) {
        showToast(res.data.message || 'Appointment booked successfully!', 'success');
        setModalOpen(false);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    let reason = '';
    if (newStatus === 'Cancelled') {
      reason = window.prompt('Enter cancellation reason (optional):') || 'Cancelled by admin';
    }

    try {
      const res = await bookingApi.updateStatusAdmin(id, newStatus, reason);
      if (res.data.success) {
        showToast(`Booking marked as ${newStatus}!`, 'success');
        fetchBookings();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream flex items-center gap-2">
            <Calendar className="w-6 h-6 text-salon-gold" />
            Appointment Bookings & Schedule
          </h1>
          <p className="text-xs text-salon-muted">
            Manage appointments, walk-ins, phone bookings, and stylist assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="p-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream hover:border-salon-gold text-xs transition-all"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4 text-salon-gold" />
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-salon-gold hover:bg-salon-gold/90 text-salon-dark font-bold text-xs uppercase tracking-wider shadow-lg shadow-salon-gold/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add New Booking
          </button>
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
              <th className="p-4">Service / Package</th>
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
                  <td className="p-4 font-bold text-salon-gold font-mono">{b.bookingId}</td>

                  <td className="p-4">
                    <p className="font-bold text-salon-cream">{b.customerName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-salon-muted font-mono">{b.customerPhone}</span>
                      {b.customerPhone && (
                        <a
                          href={`https://wa.me/91${b.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                            b.customerName
                          )}%2C%20regarding%20your%20appointment%20%23${b.bookingId}%20at%20MAKEUP%20WITH%20ART...`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-0.5 rounded text-emerald-400 hover:text-emerald-300"
                          title="WhatsApp Client"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-salon-cream">{b.itemName}</p>
                    {b.variantName && (
                      <span className="text-[10px] text-salon-gold block">({b.variantName})</span>
                    )}
                  </td>

                  <td className="p-4 font-medium">
                    <p>{b.date}</p>
                    <p className="text-[10px] text-salon-gold font-mono">
                      {b.timeSlot} ({b.duration} mins)
                    </p>
                  </td>

                  <td className="p-4 font-bold text-salon-gold">₹{b.price}</td>

                  <td className="p-4">
                    <StatusBadge status={b.status} />
                  </td>

                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    {b.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'Confirmed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black font-bold text-[10px] transition-all"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'Completed')}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-black font-bold text-[10px] transition-all"
                      >
                        Complete
                      </button>
                    )}
                    {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white font-bold text-[10px] transition-all"
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

      {/* Manual Booking Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl p-6 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-salon-border">
              <div>
                <h3 className="font-serif text-lg font-bold text-salon-cream flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-salon-gold" />
                  Add New Salon Appointment
                </h3>
                <span className="text-[11px] text-salon-muted">
                  Create a walk-in, phone call, or advance VIP booking.
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-salon-dark text-salon-muted hover:text-salon-cream"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-4">
              {/* Optional Existing Customer Quick Select */}
              {customers.length > 0 && (
                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Select Existing Client (Optional)
                  </label>
                  <select
                    onChange={(e) => handleExistingCustomerSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                  >
                    <option value="">-- Choose Existing Client or Type Below --</option>
                    {customers.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9352769045"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              {/* Item Type & Service/Package Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Type
                  </label>
                  <select
                    value={itemType}
                    onChange={(e: any) => {
                      const newType = e.target.value;
                      setItemType(newType);
                      if (newType === 'service' && services.length > 0) {
                        handleItemSelectChange('service', services[0]._id);
                      } else if (newType === 'package' && packages.length > 0) {
                        handleItemSelectChange('package', packages[0]._id);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                  >
                    <option value="service">Single Service</option>
                    <option value="package">Special Package</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Select Service / Package *
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => handleItemSelectChange(itemType, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                  >
                    {itemType === 'service'
                      ? services.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name} — ₹{s.discountPrice || s.price} ({s.category})
                          </option>
                        ))
                      : packages.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} — ₹{p.discountPrice || p.originalPrice}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              {/* Date, Time Slot & Custom Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold font-mono"
                  >
                    {availableSlots.length > 0
                      ? availableSlots.map((s) => (
                          <option key={s.time} value={s.time}>
                            {s.time} {s.available ? '' : '(Busy)'}
                          </option>
                        ))
                      : defaultSlots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              {/* Stylist & Booking Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Assign Stylist (Optional)
                  </label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                  >
                    <option value="">-- No Specific Stylist --</option>
                    {staffList.map((st) => (
                      <option key={st._id} value={st._id}>
                        {st.name} ({st.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">
                    Booking Status
                  </label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                  >
                    <option value="Confirmed">Confirmed (Sends instant confirmation)</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">
                  Internal Notes / Special Instructions
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Walk-in customer, requested bridal portfolio review"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-salon-dark text-salon-muted hover:text-salon-cream font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-salon-gold hover:bg-salon-gold/90 text-salon-dark font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'Booking...' : 'Confirm & Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
