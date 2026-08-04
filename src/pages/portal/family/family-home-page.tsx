import { useNavigate } from 'react-router-dom';
import {
  Siren, Users, Calendar,
  Bell, HandHeart,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState, StatusIndicator, AppAvatar, LocationCard } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import {
  useFamilyMembers, useUpcomingAppointments, useNotifications, useCareRequests,
} from '@/hooks/use-family-portal';
import { formatDate, formatTime } from '@/utils/date';
import { Skeleton } from '@/components/shared/skeleton';

export const FamilyHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const membersQuery = useFamilyMembers();
  const appointmentsQuery = useUpcomingAppointments();
  const notificationsQuery = useNotifications();
  const requestsQuery = useCareRequests();

  const members = membersQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];
  const notifications = notificationsQuery.data ?? [];
  const activeRequests = (requestsQuery.data ?? []).filter((r) => !['completed', 'cancelled'].includes(r.status));

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = new Date();

  return (
    <div className="flex flex-col gap-6">
      <LocationCard />

      {/* Welcome Banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-primary p-5 text-primary-foreground md:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wider text-secondary">{formatDate(today, 'EEEE, MMMM d')}</p>
            <h1 className="text-2xl font-bold md:text-3xl">Hello, {firstName}</h1>
            <p className="text-sm text-primary-foreground/90">Here&apos;s your family&apos;s care overview for today.</p>
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Family Members', value: members.length, icon: Users, to: '/portal/family/members' },
          { label: 'Active Requests', value: activeRequests.length, icon: HandHeart, to: '/portal/family/requests' },
          { label: 'Upcoming', value: appointments.length, icon: Calendar, to: '/portal/family/appointments' },
          { label: 'Notifications', value: notifications.filter((n) => !n.read).length, icon: Bell, to: '/portal/family/notifications' },
        ].map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => navigate(stat.to)}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <stat.icon className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Emergency SOS */}
      <div className="flex items-center gap-4 rounded-xl border border-destructive/20 bg-destructive/[0.03] p-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Siren className="h-7 w-7" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-base font-semibold text-foreground">Emergency SOS</h3>
          <p className="text-sm text-muted-foreground">One tap to dispatch coordinated responders to your family.</p>
        </div>
        <Button variant="destructive" size="sm" className="shrink-0" onClick={() => navigate('/portal/family/emergency')}>SOS</Button>
      </div>

      {/* Family Members */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Family Members"
          description="Your loved ones receiving care"
          actions={<Button variant="outline" size="sm" onClick={() => navigate('/portal/family/members')}>View all</Button>}
        />
        {membersQuery.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-xl border border-border bg-card">
            <EmptyState icon={Users} title="No family members yet" description="Add your first family member to start coordinating care." action={<Button size="sm" onClick={() => navigate('/portal/family/members')}>Add member</Button>} />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.slice(0, 3).map((member) => {
              const age = member.dateOfBirth ? Math.floor((Date.now() - new Date(member.dateOfBirth).getTime()) / 365.25 / 86400000) : null;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => navigate(`/portal/family/members/${member.id}`)}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary"
                >
                  <AppAvatar src={member.avatarUrl} name={member.name} className="h-12 w-12 rounded-full border border-border" />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{member.name}</span>
                      <StatusIndicator label={member.status === 'active' ? 'Active' : 'Inactive'} tone={member.status === 'active' ? 'success' : 'neutral'} />
                    </div>
                    <span className="text-xs text-muted-foreground">{member.relationship}{age ? ` · ${age} yrs` : ''}</span>
                    {member.bloodGroup && <Badge variant="outline" className="mt-1 w-fit text-xs">{member.bloodGroup}</Badge>}
                    {member.medicalConditions && member.medicalConditions.length > 0 && (
                      <span className="mt-1 line-clamp-1 text-xs text-muted-foreground">{member.medicalConditions.join(', ')}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming Appointments */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Upcoming Appointments"
          description="Scheduled care visits and consultations"
          actions={<Button variant="outline" size="sm" onClick={() => navigate('/portal/family/appointments')}>View all</Button>}
        />
        {appointmentsQuery.isLoading ? (
          <Skeleton className="h-24" />
        ) : appointments.length === 0 ? (
          <div className="rounded-xl border border-border bg-card">
            <EmptyState icon={Calendar} title="No upcoming appointments" description="Request care to schedule your next appointment." />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {appointments.slice(0, 3).map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{apt.serviceType}</span>
                  <span className="text-xs text-muted-foreground">{apt.providerName}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-medium text-foreground">{formatDate(apt.scheduledAt, 'MMM d')}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(apt.scheduledAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Notifications Preview */}
      {/* <section className="flex flex-col gap-4">
        <SectionHeader
          title="Notifications"
          description="Recent alerts and updates"
          actions={<Button variant="outline" size="sm" onClick={() => navigate('/portal/family/notifications')}>View all</Button>}
        />
        {notificationsQuery.isLoading ? (
          <SkeletonText lines={3} />
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-border bg-card">
            <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className={cn('flex items-start gap-3 rounded-lg border border-border bg-card p-3', !n.read && 'border-primary/20 bg-primary/[0.02]')}>
                <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-secondary')} />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{n.title}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">{n.message}</span>
                  <span className="text-xs text-muted-foreground">{formatRelative(n.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section> */}
    </div>
  );
};

export default FamilyHomePage;
