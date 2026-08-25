import { WorkingHours } from '../models/WorkingHours';
import { Holiday } from '../models/Holiday';
import { Booking } from '../models/Booking';

export interface ISlot {
  time: string; // e.g. "10:00"
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
  if (!workingHour || !workingHour.isOpen) {
    return [];
  }

  const openMinutes = timeToMinutes(workingHour.openTime || '09:00');
  const closeMinutes = timeToMinutes(workingHour.closeTime || '20:30');
  const breakStartMinutes = workingHour.breakStart ? timeToMinutes(workingHour.breakStart) : -1;
  const breakEndMinutes = workingHour.breakEnd ? timeToMinutes(workingHour.breakEnd) : -1;

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

    if (overlapsBreak) {
      slots.push({ time: timeStr, available: false, reason: 'Break Time' });
      continue;
    }

    // Check overlap with existing bookings
    let isBooked = false;
    for (const b of existingBookings) {
      const bStart = timeToMinutes(b.timeSlot);
      const bEnd = bStart + (b.duration || 30);

      // Overlap condition
      if (current < bEnd && slotEnd > bStart) {
        isBooked = true;
        break;
      }
    }

    if (isBooked) {
      slots.push({ time: timeStr, available: false, reason: 'Already Booked' });
    } else {
      slots.push({ time: timeStr, available: true });
    }
  }

  return slots;
};

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const hh = h < 10 ? `0${h}` : `${h}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${hh}:${mm}`;
}
