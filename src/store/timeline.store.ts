import { create } from 'zustand';
import type { TimelineEntry } from '@/types';

type TimelineState = {
  entries: TimelineEntry[];
  isLoading: boolean;
  error: string | null;
};

type TimelineActions = {
  setEntries: (entries: TimelineEntry[]) => void;
  addEntry: (entry: TimelineEntry) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export type TimelineStore = TimelineState & TimelineActions;

const initialState: TimelineState = {
  entries: [],
  isLoading: false,
  error: null,
};

export const useTimelineStore = create<TimelineStore>((set) => ({
  ...initialState,
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((s) => ({ entries: [entry, ...s.entries] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState }),
}));

export default useTimelineStore;
