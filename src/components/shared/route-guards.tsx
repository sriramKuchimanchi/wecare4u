import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store';
import { mockUsers } from '@/utils/mock-data';
import type { UserRole } from '@/types';
import { FullScreenLoader } from '@/components/shared/full-screen-loader';

type RequireAuthProps = {
  children: ReactNode;
  role?: UserRole;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession = useAuthStore((s) => s.setSession);

  // Extract requested portal role from pathname, e.g., /portal/care-provider -> care-provider
  const segments = location.pathname.split('/').filter(Boolean);
  const targetRole = (segments[1] as UserRole) ?? 'family';

  // If unauthenticated or role mismatched on portal route, auto-assign session for demo/testing
  if (!isAuthenticated || useAuthStore.getState().role !== targetRole) {
    const user = mockUsers.find((u) => u.role === targetRole) ?? mockUsers[0];
    setSession({
      user,
      token: `mock_token_${user.id}_demo`,
      refreshToken: `mock_refresh_${user.id}_demo`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      permissions: ['read', 'write'],
      verificationStatus: 'verified',
      onboardingCompleted: true,
    });
  }

  return <>{children}</>;
};

type RedirectIfAuthProps = {
  children: ReactNode;
};

export const RedirectIfAuth = ({ children }: RedirectIfAuthProps) => {
  return <>{children}</>;
};

export const RequireOnboarding = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export { FullScreenLoader };
