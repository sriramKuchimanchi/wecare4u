import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

export type UserLocation = {
  address: string;
  city: string;
  lat: number;
  lng: number;
};

type LocationState = {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
};

type LocationActions = {
  setLocation: (location: UserLocation) => void;
  refresh: () => Promise<UserLocation | null>;
};

export type LocationStore = LocationState & LocationActions;

// Coarse fallback used only if the device's coordinates can't be resolved to a
// real address at all (no geolocation support, or the reverse-geocode call fails
// with no cached location to fall back on).
const FALLBACK_LOCATION: UserLocation = {
  address: 'Location unavailable',
  city: '',
  lat: 19.076,
  lng: 72.8777,
};

// No Google Maps key in this app — BigDataCloud's free, key-less client-side
// reverse-geocode endpoint resolves the device's real GPS coordinates to an
// actual street-level locality/city instead of a hardcoded placeholder address.
const reverseGeocode = async (lat: number, lng: number): Promise<UserLocation> => {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
    );
    if (!res.ok) throw new Error('reverse-geocode failed');
    const data = await res.json();
    const city: string = data.city || data.principalSubdivision || data.countryName || '';

    // Prefer a finer-grained area/neighbourhood name that's actually distinct from the
    // city — BigDataCloud's `locality` field often just repeats the city name, which
    // would otherwise render as "Mumbai, Mumbai" instead of e.g. "Bandra West, Mumbai".
    const adminNames: string[] = (data.localityInfo?.administrative ?? [])
      .slice()
      .reverse()
      .map((a: { name?: string }) => a.name)
      .filter(Boolean);
    const area = [data.locality, ...adminNames].find((name) => name && name !== city);

    return {
      address: area || city || `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
      city,
      lat,
      lng,
    };
  } catch {
    return { address: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`, city: '', lat, lng };
  }
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      location: null,
      isLoading: false,
      error: null,

      setLocation: (location) => set({ location, error: null }),

      refresh: async () => {
        set({ isLoading: true, error: null });

        if (!('geolocation' in navigator)) {
          const fallback = get().location ?? FALLBACK_LOCATION;
          set({ location: fallback, isLoading: false, error: 'Geolocation not supported' });
          return fallback;
        }

        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const resolved = await reverseGeocode(position.coords.latitude, position.coords.longitude);
              set({ location: resolved, isLoading: false });
              resolve(resolved);
            },
            () => {
              // Permission denied or unavailable — keep any previously known location.
              set({ isLoading: false, error: 'Location unavailable' });
              resolve(get().location);
            },
            { timeout: 8000, enableHighAccuracy: true },
          );
        });
      },
    }),
    {
      name: STORAGE_KEYS.USER_LOCATION,
      partialize: (state) => ({ location: state.location }),
    },
  ),
);

export default useLocationStore;
