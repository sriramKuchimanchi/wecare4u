import type { UserRole } from '@/types';

/**
 * Permission helpers.
 * Placeholder matrix — future prompts will replace with server-driven permissions.
 */
type Permission =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'manage-users'
  | 'manage-providers'
  | 'view-logs'
  | 'respond-emergency'
  | 'manage-settings';

type Resource =
  | 'family'
  | 'care-provider'
  | 'employee'
  | 'booking'
  | 'emergency'
  | 'medical-record'
  | 'notification'
  | 'settings'
  | 'analytics';

const MATRIX: Partial<Record<UserRole, Partial<Record<Resource, Permission[]>>>> = {
  family: {
    family: ['view', 'update'],
    booking: ['view', 'create', 'update', 'delete'],
    emergency: ['view', 'create'],
    'medical-record': ['view', 'create', 'update', 'delete'],
    notification: ['view', 'update'],
    settings: ['view', 'update'],
  },
  'care-provider': {
    booking: ['view', 'update'],
    employee: ['view'],
    family: ['view'],
    'medical-record': ['view'],
  },
  employee: {
    booking: ['view', 'update'],
    family: ['view'],
    'medical-record': ['view', 'create', 'update'],
  },
  admin: {
    family: ['view', 'create', 'update', 'delete'],
    'care-provider': ['view', 'create', 'update', 'delete'],
    employee: ['view', 'create', 'update', 'delete'],
    booking: ['view', 'create', 'update', 'delete'],
    emergency: ['view', 'respond-emergency'],
    'medical-record': ['view'],
    notification: ['view'],
    settings: ['view', 'manage-settings'],
    analytics: ['view'],
  },
};

export const can = (role: UserRole | null | undefined, resource: Resource, permission: Permission): boolean => {
  if (!role) return false;
  return Boolean(MATRIX[role]?.[resource]?.includes(permission));
};

export const canAny = (role: UserRole | null | undefined, resource: Resource, permissions: Permission[]): boolean =>
  permissions.some((p) => can(role, resource, p));
