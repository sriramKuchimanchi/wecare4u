import type { UserRole } from '@/types';
import { icons, type IconName } from '@/config/icons';

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: IconName;
  badge?: string | number;
  children?: NavItem[];
};

export type NavSection = {
  id: string;
  label?: string;
  items: NavItem[];
};

export type NavConfig = {
  role: UserRole;
  sections: NavSection[];
};

const placeholder = (label: string, path: string, icon: IconName, badge?: string | number): NavItem => ({
  id: label.toLowerCase().replace(/\s+/g, '-'),
  label,
  path,
  icon,
  badge,
});

export const NAV_CONFIG: Record<UserRole, NavConfig> = {
  family: {
    role: 'family',
    sections: [
      {
        id: 'main',
        label: 'Overview',
        items: [
          placeholder('Home', '/portal/family', 'Home'),
          placeholder('Request Service', '/portal/family/request-care', 'HandHeart'),
          placeholder('My Bookings', '/portal/family/bookings', 'ClipboardList'),
          placeholder('Health Reminders', '/portal/family/health-reminders', 'Pill'),
          placeholder('Notifications', '/portal/family/notifications', 'Bell'),
          placeholder('Profile', '/portal/family/profile', 'User'),
        ],
      },
      {
        id: 'manage',
        label: 'Manage',
        items: [
          placeholder('Family Members', '/portal/family/members', 'Users'),
          // placeholder('Appointments', '/portal/family/appointments', 'Calendar'),
        ],
      },
    ],
  },
  'care-provider': {
    role: 'care-provider',
    sections: [
      {
        id: 'operations',
        label: 'Operations',
        items: [
          placeholder('Dashboard', '/portal/care-provider', 'LayoutDashboard'),
          placeholder('Service Bookings', '/portal/care-provider/bookings', 'ClipboardList'),
          placeholder('Services', '/portal/care-provider/services', 'Stethoscope'),
          placeholder('Availability', '/portal/care-provider/availability', 'Clock'),
          placeholder('Schedule', '/portal/care-provider/schedule', 'CalendarDays'),
        ],
      },
      {
        id: 'management',
        label: 'Organization',
        items: [
          placeholder('Reviews', '/portal/care-provider/reviews', 'Star'),
          placeholder('Documents', '/portal/care-provider/documents', 'FileText'),
          placeholder('Org Profile', '/portal/care-provider/organization', 'Building2'),
          placeholder('Settings', '/portal/care-provider/settings', 'Settings'),
        ],
      },
    ],
  },
  employee: {
    role: 'employee',
    sections: [
      {
        id: 'field-work',
        label: 'Field Portal',
        items: [
          placeholder('Dashboard', '/portal/employee', 'LayoutDashboard'),
          placeholder('Assigned Bookings', '/portal/employee/bookings', 'ListChecks'),
          placeholder('Today\'s Schedule', '/portal/employee/schedule', 'CalendarDays'),
          placeholder('My Availability', '/portal/employee/availability', 'UserCheck'),
          placeholder('Notifications', '/portal/employee/notifications', 'Bell'),
          placeholder('Search', '/portal/employee/search', 'Search'),
        ],
      },
    ],
  },
  admin: {
    role: 'admin',
    sections: [
      {
        id: 'overview',
        label: 'Overview',
        items: [
          placeholder('Dashboard', '/portal/admin', 'LayoutDashboard'),
          placeholder('Families', '/portal/admin/families', 'Users'),
          placeholder('Service Providers', '/portal/admin/providers', 'Building2'),
        ],
      },
      {
        id: 'operations',
        label: 'Operations',
        items: [
          placeholder('Service Bookings', '/portal/admin/bookings', 'ClipboardList'),
          placeholder('Emergency Center', '/portal/admin/emergency', 'Siren'),
        ],
      },
      {
        id: 'system',
        label: 'Platform',
        items: [
          placeholder('Notifications', '/portal/admin/notifications', 'Bell'),
          placeholder('Categories', '/portal/admin/categories', 'Tags'),
          placeholder('Settings', '/portal/admin/settings', 'Settings'),
        ],
      },
    ],
  },
};

export const getNavConfig = (role: UserRole): NavConfig => NAV_CONFIG[role];

export const getBottomNavItems = (role: UserRole): NavItem[] => {
  const sections = NAV_CONFIG[role].sections;
  const first = sections[0]?.items ?? [];
  return first.slice(0, 5);
};

export { icons };
