import { create } from 'zustand';
import type { Booking } from '@/types';

type BookingState = {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
};

type BookingActions = {
  setBookings: (bookings: Booking[]) => void;
  setCurrentBooking: (booking: Booking | null) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  removeBooking: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export type BookingStore = BookingState & BookingActions;

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

export const useBookingStore = create<BookingStore>((set) => ({
  ...initialState,
  setBookings: (bookings) => set({ bookings }),
  setCurrentBooking: (currentBooking) => set({ currentBooking }),
  addBooking: (booking) => set((s) => ({ bookings: [...s.bookings, booking] })),
  updateBooking: (id, patch) =>
    set((s) => ({
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      currentBooking:
        s.currentBooking?.id === id ? { ...s.currentBooking, ...patch } : s.currentBooking,
    })),
  removeBooking: (id) =>
    set((s) => ({
      bookings: s.bookings.filter((b) => b.id !== id),
      currentBooking: s.currentBooking?.id === id ? null : s.currentBooking,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState }),
}));

export default useBookingStore;
