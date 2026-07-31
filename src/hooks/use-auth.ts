import { useAuthStore } from '@/store';
import { useCurrentUserStore } from '@/store';
import type { UserRole } from '@/types';

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setSession = useAuthStore((s) => s.setSession);
  const setLoading = useAuthStore((s) => s.setLoading);
  const reset = useAuthStore((s) => s.reset);

  const role: UserRole | null = user?.role ?? null;

  return {
    session,
    user,
    role,
    isAuthenticated,
    isLoading,
    setSession,
    setLoading,
    reset,
  };
}

export function useCurrentUser() {
  return useCurrentUserStore();
}

export default useAuth;
