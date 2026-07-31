import { create } from 'zustand';
import type { CareProvider } from '@/types';

type CareProviderState = {
  providers: CareProvider[];
  currentProvider: CareProvider | null;
  isLoading: boolean;
  error: string | null;
};

type CareProviderActions = {
  setProviders: (providers: CareProvider[]) => void;
  setCurrentProvider: (provider: CareProvider | null) => void;
  addProvider: (provider: CareProvider) => void;
  updateProvider: (id: string, patch: Partial<CareProvider>) => void;
  removeProvider: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export type CareProviderStore = CareProviderState & CareProviderActions;

const initialState: CareProviderState = {
  providers: [],
  currentProvider: null,
  isLoading: false,
  error: null,
};

export const useCareProviderStore = create<CareProviderStore>((set) => ({
  ...initialState,
  setProviders: (providers) => set({ providers }),
  setCurrentProvider: (currentProvider) => set({ currentProvider }),
  addProvider: (provider) => set((s) => ({ providers: [...s.providers, provider] })),
  updateProvider: (id, patch) =>
    set((s) => ({
      providers: s.providers.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      currentProvider:
        s.currentProvider?.id === id ? { ...s.currentProvider, ...patch } : s.currentProvider,
    })),
  removeProvider: (id) =>
    set((s) => ({
      providers: s.providers.filter((p) => p.id !== id),
      currentProvider: s.currentProvider?.id === id ? null : s.currentProvider,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState }),
}));

export default useCareProviderStore;
