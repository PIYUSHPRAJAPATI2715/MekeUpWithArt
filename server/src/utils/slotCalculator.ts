import { WorkingHours } from '../models/WorkingHours';
import { Holiday } from '../models/Holiday';
import { Booking } from '../models/Booking';

export interface ISlot {
  time: string; // e.g. "10:30 AM" or "10:30"
  available: boolean;
  reason?: string;
}

export const getAvailableSlotsForDate = async (dateStr: string, itemDurationMinutes: number = 30): Promise<ISlot[]> => {
  // Check if date is holiday
  const holiday = await Holiday.findOne({ date: dateStr, isFullDay: true });
  if (holiday) {
    return [];
  }

  // Get day of week (e.g., 'Monday')
  const dateObj = new Date(dateStr);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[dateObj.getDay()];

  const workingHour = await WorkingHours.findOne({ day: dayName });
  if (workingHour && !workingHour.isOpen) {
    return [];
  }

  const openTime = workingHour?.openTime || '10:30';
  const closeTime = workingHour?.closeTime || '21:30';

  const openMinutes = timeToMinutes(openTime);
  const closeMinutes = timeToMinutes(closeTime);
  const breakStartMinutes = workingHour?.breakStart ? timeToMinutes(workingHour.breakStart) : -1;
  const breakEndMinutes = workingHour?.breakEnd ? timeToMinutes(workingHour.breakEnd) : -1;

  // Fetch all active bookings on that date
  const existingBookings = await Booking.find({
    date: dateStr,
    status: { $in: ['Pending', 'Confirmed'] },
  });

  const slots: ISlot[] = [];
  const interval = 30; // 30 minute slot increments

  for (let current = openMinutes; current + itemDurationMinutes <= closeMinutes; current += interval) {
    const slotEnd = current + itemDurationMinutes;
    const timeStr = minutesToTime(current);

    // Check if slot falls in break time
    let overlapsBreak = false;
    if (breakStartMinutes !== -1 && breakEndMinutes !== -1) {
      if (current < breakEndMinutes && slotEnd > breakStartMinutes) {
        overlapsBreak = true;
      }
    }

    // Check if slot overlaps with existing booking
    let overlapsBooking = false;
    for (const b of existingBookings) {
      const bStart = timeToMinutes(b.timeSlot);
      const bEnd = bStart + (b.duration || 30);
      if (current < bEnd && slotEnd > bStart) {
        overlapsBooking = true;
        break;
      }
    }

    const isAvailable = !overlapsBreak && !overlapsBooking;
    slots.push({
      time: format12Hour(timeStr),
      available: isAvailable,
      reason: overlapsBreak ? 'Break Time' : overlapsBooking ? 'Already Booked' : undefined,
    });
  }

  return slots;
};

const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 630; // 10:30 default
  const clean = timeStr.trim().toLowerCase();
  
  let hours = 0;
  let minutes = 0;
  
  if (clean.includes('am') || clean.includes('pm')) {
    const isPM = clean.includes('pm');
    const timePart = clean.replace(/am|pm/g, '').trim();
    const parts = timePart.split(':');
    hours = parseInt(parts[0], 10);
    minutes = parts[1] ? parseInt(parts[1], 10) : 0;
    
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
  } else {
    const parts = clean.split(':');
    hours = parseInt(parts[0], 10);
    minutes = parts[1] ? parseInt(parts[1], 10) : 0;
  }
  
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const padH = hours < 10 ? `0${hours}` : `${hours}`;
  const padM = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${padH}:${padM}`;
};

const format12Hour = (time24: string): string => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const padH = h12 < 10 ? `0${h12}` : `${h12}`;
  const padM = m < 10 ? `0${m}` : `${m}`;
  return `${padH}:${padM} ${period}`;
};
