import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, AuthSession, VerificationStatus } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { portalPathForRole } from '@/constants/routes';
type AuthState = {
  session: AuthSession | null;
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  permissions: string[];
  verificationStatus: VerificationStatus | null;
  onboardingCompleted: boolean;
  rememberMe: boolean;
};

type AuthActions = {
  setSession: (session: AuthSession | null) => void;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOnboardingCompleted: (done: boolean) => void;
  setVerificationStatus: (status: VerificationStatus | null) => void;
  updatePermissions: (permissions: string[]) => void;
  reset: () => void;
  getRedirectPath: () => string;
};

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  session: null,
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  refreshToken: null,
  permissions: [],
  verificationStatus: null,
  onboardingCompleted: false,
  rememberMe: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
          role: session?.user?.role ?? null,
          isAuthenticated: Boolean(session),
          token: session?.token ?? null,
          refreshToken: session?.refreshToken ?? null,
          permissions: session?.permissions ?? [],
          verificationStatus: session?.verificationStatus ?? null,
          onboardingCompleted: session?.onboardingCompleted ?? false,
          rememberMe: session?.rememberMe ?? false,
          error: null,
        }),

      setUser: (user) => set({ user, role: user?.role ?? null }),
      setRole: (role) => set({ role }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      setOnboardingCompleted: (onboardingCompleted) => {
        set({ onboardingCompleted });
        const s = get().session;
        if (s) set({ session: { ...s, onboardingCompleted } });
      },

      setVerificationStatus: (verificationStatus) => {
        set({ verificationStatus });
        const s = get().session;
        if (s && verificationStatus) set({ session: { ...s, verificationStatus } });
      },

      updatePermissions: (permissions) => {
        set({ permissions });
        const s = get().session;
        if (s) set({ session: { ...s, permissions } });
      },

      reset: () => set({ ...initialState }),

      getRedirectPath: () => {
        const role = get().role;
        return role ? portalPathForRole(role) : '/';
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken,
        permissions: state.permissions,
        verificationStatus: state.verificationStatus,
        onboardingCompleted: state.onboardingCompleted,
        rememberMe: state.rememberMe,
      }),
    },
  ),
);

export default useAuthStore;
