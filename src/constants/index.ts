import type { UserRole } from '@/types';

/**
 * Application-wide constants
 */

export const APP_NAME = 'We Care For You';
export const APP_SHORT_NAME = 'WeCare';
export const APP_TAGLINE = 'AI-Powered Care Coordination Platform';
export const APP_DESCRIPTION =
  'Connecting families with verified service providers for healthcare, emergency response, home care, transportation, pharmacies, laboratories and more.';

export const SUPPORT_EMAIL = 'support@wecare4you.app';
export const SUPPORT_PHONE = '+1 (800) 000-0000';

export const ROLES: UserRole[] = ['family', 'care-provider', 'employee', 'admin'];

export const ROLE_LABELS: Record<UserRole, string> = {
  family: 'Family',
  'care-provider': 'Service Provider',
  employee: 'Employee',
  admin: 'Administrator',
};

export const PORTAL_LABELS: Record<UserRole, string> = {
  family: 'Family Portal',
  'care-provider': 'Service Provider Portal',
  employee: 'Employee Portal',
  admin: 'Administrator Portal',
};

export const DEFAULT_PAGE_SIZE = 20;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'wecare:auth_token',
  REFRESH_TOKEN: 'wecare:refresh_token',
  USER_PREFERENCES: 'wecare:user_prefs',
  ONBOARDED: 'wecare:onboarded',
  LANGUAGE: 'wecare:language',
} as const;

export const API_TIMEOUT_MS = 30000;

export const QUERY_KEYS = {
  auth: ['auth'] as const,
  currentUser: ['auth', 'currentUser'] as const,
  families: ['families'] as const,
  family: (id: string) => ['families', id] as const,
  careProviders: ['care-providers'] as const,
  careProvider: (id: string) => ['care-providers', id] as const,
  employees: ['employees'] as const,
  employee: (id: string) => ['employees', id] as const,
  bookings: ['bookings'] as const,
  booking: (id: string) => ['bookings', id] as const,
  emergencies: ['emergencies'] as const,
  emergency: (id: string) => ['emergencies', id] as const,
  timeline: ['timeline'] as const,
  notifications: ['notifications'] as const,
  medicalRecords: ['medical-records'] as const,
  medicalRecord: (id: string) => ['medical-records', id] as const,
  settings: ['settings'] as const,
} as const;

export const PWA = {
  THEME_COLOR: '#1E6FBF',
  BACKGROUND_COLOR: '#FFFFFF',
} as const;
