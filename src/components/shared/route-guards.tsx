import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store';
import { portalPathForRole } from '@/constants/routes';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/types';
import { FullScreenLoader } from '@/components/shared/full-screen-loader';

type RequireAuthProps = {
  children: ReactNode;
  role?: UserRole;
};

export const RequireAuth = ({ children, role }: RequireAuthProps) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.role);
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location.pathname }} replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole ? portalPathForRole(userRole) : ROUTES.login} replace />;
  }

  if (!onboardingCompleted && userRole !== 'admin') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

type RedirectIfAuthProps = {
  children: ReactNode;
};

export const RedirectIfAuth = ({ children }: RedirectIfAuthProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);

  if (isAuthenticated && role) {
    if (!onboardingCompleted && role !== 'admin') {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to={portalPathForRole(role)} replace />;
  }
  return <>{children}</>;
};

export const RequireOnboarding = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const onboardingCompleted = useAuthStore((s) => s.onboardingCompleted);

  if (!isAuthenticated || !role) {
    return <Navigate to={ROUTES.login} replace />;
  }
  if (onboardingCompleted) {
    return <Navigate to={portalPathForRole(role)} replace />;
  }
  return <>{children}</>;
};

export { FullScreenLoader };
