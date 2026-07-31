import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '@/types';
import { STORAGE_KEYS } from '@/constants';

type SettingsState = {
  settings: AppSettings;
  isLoading: boolean;
};

type SettingsActions = {
  updateSettings: (patch: Partial<AppSettings>) => void;
  reset: () => void;
};

export type SettingsStore = SettingsState & SettingsActions;

const defaultSettings: AppSettings = {
  language: 'en',
  timezone: 'Asia/Dubai',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

const initialState: SettingsState = {
  settings: defaultSettings,
  isLoading: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      reset: () => set({ ...initialState }),
    }),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);

export default useSettingsStore;
