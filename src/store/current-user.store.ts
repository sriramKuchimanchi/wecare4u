import { create } from 'zustand';
import type { User, UserRole } from '@/types';

type CurrentUserState = {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
};

type CurrentUserActions = {
  setCurrentUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  clear: () => void;
};

export type CurrentUserStore = CurrentUserState & CurrentUserActions;

const initialState: CurrentUserState = {
  user: null,
  role: null,
  isLoading: false,
};

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  ...initialState,
  setCurrentUser: (user) => set({ user, role: user?.role ?? null }),
  setRole: (role) => set({ role }),
  clear: () => set({ ...initialState }),
}));

export default useCurrentUserStore;
