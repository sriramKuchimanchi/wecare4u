import { create } from 'zustand';

/**
 * Theme store.
 * Per project spec, dark mode is NEVER supported.
 * This store exists for future accent / density / font-size preferences.
 */
type ThemeState = {
  accent: 'blue' | 'orange';
  density: 'comfortable' | 'compact';
  fontScale: 'sm' | 'base' | 'lg';
};

type ThemeActions = {
  setAccent: (accent: ThemeState['accent']) => void;
  setDensity: (density: ThemeState['density']) => void;
  setFontScale: (scale: ThemeState['fontScale']) => void;
  reset: () => void;
};

export type ThemeStore = ThemeState & ThemeActions;

const initialState: ThemeState = {
  accent: 'blue',
  density: 'comfortable',
  fontScale: 'base',
};

export const useThemeStore = create<ThemeStore>((set) => ({
  ...initialState,
  setAccent: (accent) => set({ accent }),
  setDensity: (density) => set({ density }),
  setFontScale: (fontScale) => set({ fontScale }),
  reset: () => set({ ...initialState }),
}));

export default useThemeStore;
