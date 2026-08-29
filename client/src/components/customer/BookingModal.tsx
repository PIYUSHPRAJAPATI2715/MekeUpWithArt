import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User as UserIcon,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { bookingApi, staffApi } from '../../api';
import { IService, IPackage, IStaff } from '../../types';
import { useToast } from '../common/Toast';
import { Link } from 'react-router-dom';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: IService | IPackage | null;
  itemType: 'service' | 'package';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  item,
  itemType,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'form' | 'success'>('form');

  // Form Fields
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || '');
  const [notes, setNotes] = useState<string>('');

  // Loaded Slots & Staff
  const [slots, setSlots] = useState<{ time: string; available: boolean; reason?: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resulting Booking Data
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
    }
  }, [user]);

  // Load Staff List
  useEffect(() => {
    if (isOpen) {
      staffApi
        .getAllPublic()
        .then((res) => {
          if (res.data.success) setStaffList(res.data.data);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  // Load Available Time Slots whenever Date or Item changes
  useEffect(() => {
    if (isOpen && item && date) {
      setLoadingSlots(true);
      setTimeSlot('');
      const duration = item.duration || 45;
      bookingApi
        .getSlots(date, duration)
        .then((res) => {
          if (res.data.success) {
            setSlots(res.data.slots);
          }
        })
        .catch((err) => {
          console.error(err);
          showToast('Failed to load available slots for this date', 'error');
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [isOpen, item, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    if (!timeSlot) {
      showToast('Please select an available time slot', 'error');
      return;
    }
    if (!customerName || !customerPhone || !customerEmail) {
      showToast('Please fill in your contact information', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        itemType,
        itemId: item?._id,
        date,
        timeSlot,
        staff: selectedStaff || undefined,
        customerName,
        customerPhone,
        customerEmail,
        notes,
        variantName: selectedVariant || undefined,
      };

      const res = await bookingApi.create(payload);
      if (res.data.success) {
        setConfirmedBooking(res.data.data);
        setStep('success');
        showToast('Appointment booked successfully!', 'success');

        // Trigger Google Ads Lead Conversion Event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-18398292781/ggbkCOudhOocEK3W_sRE',
          });
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to complete booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl p-6 sm:p-8 overflow-hidden rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-salon-border transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Unauthenticated State Warning */}
          {!isAuthenticated ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-salon-gold/10 border border-salon-gold/30 flex items-center justify-center mx-auto text-salon-gold">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-serif text-2xl font-bold text-salon-cream">
                  Authentication Required
                </h3>
                <p className="text-sm text-salon-muted">
                  Please login or create an account to complete your appointment booking with MAKEUP WITH ART.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-salon-card border border-salon-gold/40 text-salon-gold text-xs font-bold hover:bg-salon-gold hover:text-salon-dark transition-all"
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </div>
          ) : step === 'form' ? (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-salon-border pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-salon-gold block">
                  Book Appointment
                </span>
                <h3 className="font-serif text-2xl font-bold text-salon-cream">
                  {item.name}
                </h3>
                <p className="text-xs text-salon-muted mt-1">
                  Duration: {item.duration} mins • Price: ₹
                  {'discountPrice' in item && item.discountPrice ? item.discountPrice : ('price' in item ? item.price : item.originalPrice)}
                </p>
              </div>

              {/* Service Variants (If Any) */}
              {'variants' in item && item.variants && item.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider">
                    Select Package Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {item.variants.map((v) => (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setSelectedVariant(v.name)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedVariant === v.name
                            ? 'bg-salon-gold/15 border-salon-gold text-salon-cream'
                            : 'bg-salon-dark/60 border-salon-border text-salon-muted hover:border-salon-gold/40'
                        }`}
                      >
                        <p className="text-xs font-bold">{v.name}</p>
                        <p className="text-[11px] text-salon-gold">₹{v.price}</p>
                        <p className="text-[9px] text-salon-muted">{v.duration} mins</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date & Staff Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-2">
                    Appointment Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold transition-colors"
                    />
                    <Calendar className="w-4 h-4 text-salon-gold absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-2">
                    Preferred Artist (Optional)
                  </label>
                  <select
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold transition-colors"
                  >
                    <option value="">Any Available Specialist</option>
                    {staffList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.designation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Available Time Slots Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider">
                    Select Available Time Slot
                  </label>
                  <span className="text-[10px] text-salon-gold">Operating: 09:30 AM – 08:30 PM</span>
                </div>

                {loadingSlots ? (
                  <div className="py-8 text-center text-xs text-salon-muted animate-pulse">
                    Calculating available slots...
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
                    No slots available on this date (Salon closed or holiday). Please pick another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setTimeSlot(slot.time)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          !slot.available
                            ? 'bg-salon-dark/40 border-salon-border/40 text-salon-muted/40 cursor-not-allowed line-through'
                            : timeSlot === slot.time
                            ? 'bg-salon-gold text-salon-dark border-salon-gold shadow-md'
                            : 'bg-salon-dark/80 border-salon-border text-salon-cream hover:border-salon-gold/60'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-salon-muted mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-salon-muted mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-salon-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-salon-muted mb-1">
                  Additional Notes / Hair & Skin Preferences (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sensitive scalp, warm water wash requested"
                  className="w-full px-3.5 py-2 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-salon-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-salon-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !timeSlot}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-lg shadow-salon-gold/20 hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-salon-dark" />
                  {isSubmitting ? 'CONFIRMING...' : 'CONFIRM APPOINTMENT'}
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation Step */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-salon-gold">
                  Booking Confirmed
                </span>
                <h3 className="font-serif text-3xl font-bold text-salon-cream">
                  Appointment Received!
                </h3>
                <p className="text-xs text-salon-muted max-w-sm mx-auto">
                  We look forward to seeing you at MAKEUP WITH ART, Shyam Nagar Metro Station.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-salon-card/80 border border-salon-gold/30 text-left space-y-2.5 text-xs max-w-md mx-auto">
                <div className="flex justify-between border-b border-salon-border/60 pb-2">
                  <span className="text-salon-muted">Booking ID:</span>
                  <span className="font-bold text-salon-gold">{confirmedBooking?.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-salon-muted">Service / Package:</span>
                  <span className="font-semibold text-salon-cream">{confirmedBooking?.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-salon-muted">Date & Time:</span>
                  <span className="font-semibold text-salon-cream">
                    {confirmedBooking?.date} @ {confirmedBooking?.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-salon-muted">Amount Payable:</span>
                  <span className="font-bold text-salon-gold">₹{confirmedBooking?.price}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
