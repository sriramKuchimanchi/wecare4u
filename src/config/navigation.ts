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
          placeholder('Request Care', '/portal/family/request-care', 'HandHeart'),
          placeholder('Timeline', '/portal/family/timeline', 'History'),
          placeholder('Notifications', '/portal/family/notifications', 'Bell'),
          placeholder('Profile', '/portal/family/profile', 'User'),
        ],
      },
      {
        id: 'manage',
        label: 'Manage',
        items: [
          placeholder('Family Members', '/portal/family/members', 'Users'),
          placeholder('Appointments', '/portal/family/appointments', 'Calendar'),
          placeholder('Search', '/portal/family/search', 'Search'),
        ],
      },
    ],
  },
  'care-provider': {
    role: 'care-provider',
    sections: [
      {
        id: 'main',
        label: 'Overview',
        items: [
          placeholder('Dashboard', '/portal/care-provider', 'LayoutDashboard'),
          placeholder('Bookings', '/portal/care-provider/bookings', 'Calendar'),
          placeholder('Patients', '/portal/care-provider/patients', 'Users'),
          placeholder('Staff', '/portal/care-provider/staff', 'Briefcase'),
        ],
      },
      {
        id: 'services',
        label: 'Services',
        items: [
          placeholder('Services', '/portal/care-provider/services', 'Stethoscope'),
          placeholder('Schedule', '/portal/care-provider/schedule', 'CalendarDays'),
          placeholder('Reports', '/portal/care-provider/reports', 'ClipboardList'),
        ],
      },
    ],
  },
  employee: {
    role: 'employee',
    sections: [
      {
        id: 'main',
        label: 'Overview',
        items: [
          placeholder('Dashboard', '/portal/employee', 'LayoutDashboard'),
          placeholder('My Tasks', '/portal/employee/tasks', 'ListChecks'),
          placeholder('Schedule', '/portal/employee/schedule', 'CalendarDays'),
          placeholder('Patients', '/portal/employee/patients', 'Users'),
        ],
      },
      {
        id: 'support',
        label: 'Support',
        items: [
          placeholder('Reports', '/portal/employee/reports', 'ClipboardList'),
          placeholder('Messages', '/portal/employee/messages', 'MessageSquare'),
        ],
      },
    ],
  },
  admin: {
    role: 'admin',
    sections: [
      {
        id: 'main',
        label: 'Overview',
        items: [
          placeholder('Dashboard', '/portal/admin', 'LayoutDashboard'),
          placeholder('Families', '/portal/admin/families', 'Users'),
          placeholder('Providers', '/portal/admin/providers', 'Building2'),
          placeholder('Employees', '/portal/admin/employees', 'Briefcase'),
        ],
      },
      {
        id: 'system',
        label: 'System',
        items: [
          placeholder('Bookings', '/portal/admin/bookings', 'Calendar'),
          placeholder('Emergency Log', '/portal/admin/emergency', 'Siren'),
          placeholder('Analytics', '/portal/admin/analytics', 'Activity'),
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
