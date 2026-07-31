import type { UserRole } from '@/types';

/**
 * Centralized route paths.
 * Future prompts reference these instead of hardcoding strings.
 */
export const ROUTES = {
  // Public
  landing: '/',
  // Auth
  login: '/login',
  register: '/register',
  // Portals
  family: '/portal/family',
  careProvider: '/portal/care-provider',
  employee: '/portal/employee',
  admin: '/portal/admin',
  // Not found
  notFound: '*',
} as const;

export type PortalRoute = {
  path: string;
  role: UserRole;
};

export const PORTAL_ROUTES: PortalRoute[] = [
  { path: ROUTES.family, role: 'family' },
  { path: ROUTES.careProvider, role: 'care-provider' },
  { path: ROUTES.employee, role: 'employee' },
  { path: ROUTES.admin, role: 'admin' },
];

export const portalPathForRole = (role: UserRole): string => {
  switch (role) {
    case 'family':
      return ROUTES.family;
    case 'care-provider':
      return ROUTES.careProvider;
    case 'employee':
      return ROUTES.employee;
    case 'admin':
      return ROUTES.admin;
  }
};

export default ROUTES;
