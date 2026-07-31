import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader, SectionHeader, EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from '@/config/icons';
import { PORTAL_LABELS, ROLE_LABELS } from '@/constants';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/types';

const portalIntro: Record<UserRole, string> = {
  family: 'Coordinate care for your loved ones — bookings, medical records, emergency response and more.',
  'care-provider': 'Manage your care services, bookings, staff and patient relationships.',
  employee: 'View your assigned tasks, schedule and patient coordination.',
  admin: 'Oversee families, providers, employees and platform-wide activity.',
};

const placeholderSections: Record<UserRole, { title: string; description: string }[]> = {
  family: [
    { title: 'Care Members', description: 'Profiles for each family member receiving care.' },
    { title: 'Upcoming Bookings', description: 'Scheduled services and appointments.' },
    { title: 'Recent Activity', description: 'Timeline of recent care events.' },
  ],
  'care-provider': [
    { title: 'Today’s Schedule', description: 'Bookings and staff assignments for today.' },
    { title: 'Patient Roster', description: 'Families and members you currently serve.' },
    { title: 'Service Catalog', description: 'Services your organization offers.' },
  ],
  employee: [
    { title: 'My Tasks', description: 'Assigned care visits and follow-ups.' },
    { title: 'My Schedule', description: 'Upcoming shifts and appointments.' },
    { title: 'Patient Notes', description: 'Recent observations and care notes.' },
  ],
  admin: [
    { title: 'Platform Overview', description: 'Families, providers and employees at a glance.' },
    { title: 'Emergency Log', description: 'Recent emergency events and resolutions.' },
    { title: 'Analytics', description: 'Usage and operational insights.' },
  ],
};

export const PortalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roleSegment = location.pathname.split('/')[2] as UserRole;
  const role: UserRole = ['family', 'care-provider', 'employee', 'admin'].includes(roleSegment) ? roleSegment : 'family';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.landing)} className="text-muted-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to home
        </Button>
      </div>

      <PageHeader
        title={PORTAL_LABELS[role]}
        description={portalIntro[role]}
        actions={
          <Button size="sm">
            <span className="hidden sm:inline">Quick action</span>
            <span className="sm:hidden">Action</span>
          </Button>
        }
      />

      <div className="rounded-xl border border-dashed border-border bg-surface p-6">
        <EmptyState
          icon={Construction}
          title="This area is under construction"
          description="The foundation is ready. Future prompts will inject dashboards, booking modules and business workflows here."
        />
      </div>

      <div className="flex flex-col gap-8">
        {placeholderSections[role].map((section) => (
          <section key={section.title} className="flex flex-col gap-4">
            <SectionHeader title={section.title} description={section.description} divider />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl border border-dashed border-border bg-surface" />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{ROLE_LABELS[role]}</span> · Foundation ready for feature injection.
      </p>
    </div>
  );
};

export default PortalPage;
