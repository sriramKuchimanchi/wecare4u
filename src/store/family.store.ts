import { create } from 'zustand';
import type { Family } from '@/types';

type FamilyState = {
  families: Family[];
  currentFamily: Family | null;
  isLoading: boolean;
  error: string | null;
};

type FamilyActions = {
  setFamilies: (families: Family[]) => void;
  setCurrentFamily: (family: Family | null) => void;
  addFamily: (family: Family) => void;
  updateFamily: (id: string, patch: Partial<Family>) => void;
  removeFamily: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export type FamilyStore = FamilyState & FamilyActions;

const initialState: FamilyState = {
  families: [],
  currentFamily: null,
  isLoading: false,
  error: null,
};

export const useFamilyStore = create<FamilyStore>((set) => ({
  ...initialState,
  setFamilies: (families) => set({ families }),
  setCurrentFamily: (currentFamily) => set({ currentFamily }),
  addFamily: (family) => set((s) => ({ families: [...s.families, family] })),
  updateFamily: (id, patch) =>
    set((s) => ({
      families: s.families.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      currentFamily:
        s.currentFamily?.id === id ? { ...s.currentFamily, ...patch } : s.currentFamily,
    })),
  removeFamily: (id) =>
    set((s) => ({
      families: s.families.filter((f) => f.id !== id),
      currentFamily: s.currentFamily?.id === id ? null : s.currentFamily,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState }),
}));

export default useFamilyStore;
