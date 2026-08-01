import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store';
import type { UserRole } from '@/types';
import { FullScreenLoader } from '@/components/shared/full-screen-loader';

type RequireAuthProps = {
  children: ReactNode;
  role?: UserRole;
};

/**
  Guard for portal routes (/portal/:role/*).
  Requires the user to be authenticated. If unauthenticated, redirects to /login.
  If authenticated under a different role (e.g. employee trying to access admin),
  redirects to the user's authorized portal.
 */
export const RequireAuth = ({ children, role: requiredRole }: RequireAuthProps) => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuthStore();

  // Extract target portal role from pathname, e.g., /portal/admin -> admin
  const segments = location.pathname.split('/').filter(Boolean);
  const targetRole = requiredRole ?? (segments[1] as UserRole) ?? 'family';

  // If unauthenticated, redirect to login page
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged-in user attempts to access a portal of a different role, redirect to their authorized portal
  if (role !== targetRole) {
    return <Navigate to={`/portal/${role}`} replace />;
  }

  return <>{children}</>;
};

type RedirectIfAuthProps = {
  children: ReactNode;
};

/**
 * Renders auth pages (login/register/forgot-password).
 * Allows users to access auth screens freely without forced redirects.
 */
export const RedirectIfAuth = ({ children }: RedirectIfAuthProps) => {
  return <>{children}</>;
};

export const RequireOnboarding = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export { FullScreenLoader };
