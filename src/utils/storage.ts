/**
 * Safe wrappers around browser storage so persistence is testable and SSR-safe.
 */
const isBrowser = typeof window !== 'undefined';

export const storage = {
  get(key: string): string | null {
    if (!isBrowser) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* quota or privacy mode */
    }
  },

  getJSON<T>(key: string, fallback: T): T {
    const raw = storage.get(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  setJSON<T>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  },

  remove(key: string): void {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },

  clear(prefix?: string): void {
    if (!isBrowser) return;
    try {
      if (!prefix) {
        window.localStorage.clear();
        return;
      }
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith(prefix))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  },
};

export default storage;
