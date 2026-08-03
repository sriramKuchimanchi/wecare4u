import { useNavigate } from 'react-router-dom';
import {
  Heart, Siren, Pill, Activity, Users, Calendar,
  Bell, Sparkles, ArrowRight, HandHeart, LifeBuoy, Search, CheckCircle,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState, StatusIndicator } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import {
  useFamilyMembers, useUpcomingAppointments, useTimeline, useNotifications, useCareRequests,
} from '@/hooks/use-family-portal';
import { useMedicationReminderStore } from '@/store/medication-reminder.store';
import { formatDate, formatTime, formatRelative } from '@/utils/date';
import { Skeleton, SkeletonText } from '@/components/shared/skeleton';
import { cn } from '@/lib/utils';
import type { LucideIcon } from '@/config/icons';

const quickActions: { label: string; icon: LucideIcon; to: string; tone: 'primary' | 'secondary' | 'danger' }[] = [
  { label: 'Request Care', icon: HandHeart, to: '/portal/family/request-care', tone: 'primary' },
  { label: 'Get Assistance', icon: LifeBuoy, to: '/portal/family/request-care', tone: 'secondary' },
  { label: 'Need Help?', icon: Heart, to: '/portal/family/request-care', tone: 'primary' },
  { label: 'Find Care', icon: Search, to: '/portal/family/search', tone: 'secondary' },
  { label: 'Emergency SOS', icon: Siren, to: '/portal/family', tone: 'danger' },
];

const toneClasses: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  danger: 'bg-destructive/10 text-destructive',
};

export const FamilyHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const membersQuery = useFamilyMembers();
  const appointmentsQuery = useUpcomingAppointments();
  const timelineQuery = useTimeline();
  const notificationsQuery = useNotifications();
  const requestsQuery = useCareRequests();
  const { reminders, updateStatus } = useMedicationReminderStore();
  const pendingMeds = reminders.filter((r) => r.status === 'pending');

  const members = membersQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];
  const timeline = timelineQuery.data ?? [];
  const notifications = notificationsQuery.data ?? [];
  const activeRequests = (requestsQuery.data ?? []).filter((r) => !['completed', 'cancelled'].includes(r.status));

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = new Date();
  const todaysTimeline = timeline.filter((t) => new Date(t.createdAt).toDateString() === today.toDateString());

  return (
    <div className="flex flex-col gap-6">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => navigate(action.to)}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary hover:shadow-sm"
          >
            <span className={cn('flex h-12 w-12 items-center justify-center rounded-full', toneClasses[action.tone])}>
              <action.icon className="h-6 w-6" />
            </span>
            <span className="text-xs font-semibold text-foreground sm:text-sm">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Family Members', value: members.length, icon: Users, to: '/portal/family/members' },
          { label: 'Active Requests', value: activeRequests.length, icon: HandHeart, to: '/portal/family/request-care' },
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

      {/* Emergency SOS + AI Assistant */}
      <div className="grid gap-4 md:grid-cols-2">
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
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <Sparkles className="h-7 w-7" />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <h3 className="text-base font-semibold text-foreground">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Get personalized care suggestions and timeline summaries.</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate('/portal/family/ai-assistant')}>Ask</Button>
        </div>
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
                  <Avatar className="h-12 w-12 border border-border">
                    {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.name} />}
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </AvatarFallback>
                  </Avatar>
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

      {/* Medication Reminders */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="Medication Reminders" description="Upcoming medication schedules" />
        {pendingMeds.length === 0 ? (
          <div className="rounded-xl border border-border bg-card">
            <EmptyState icon={Pill} title="No pending medications" description="All medications are up to date." />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pendingMeds.slice(0, 3).map((med) => (
              <div key={med.id} className="flex items-center gap-3 rounded-xl border border-warning/20 bg-warning/[0.03] p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Pill className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{med.medicineName} — {med.memberName}</span>
                  <span className="text-xs text-muted-foreground">{med.frequency} · {med.time}</span>
                </div>
                <Button variant="outline" size="sm" className="shrink-0" onClick={() => updateStatus(med.id, 'taken')}>
                  <CheckCircle className="mr-1.5 h-4 w-4 text-success" /> Mark taken
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Health Timeline Preview */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Recent Activity"
          description="Latest care events for your family"
          actions={<Button variant="outline" size="sm" onClick={() => navigate('/portal/family/timeline')}>View all</Button>}
        />
        {timelineQuery.isLoading ? (
          <SkeletonText lines={4} />
        ) : timeline.length === 0 ? (
          <div className="rounded-xl border border-border bg-card">
            <EmptyState icon={Activity} title="No activity yet" description="Care events will appear here as they happen." />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {timeline.slice(0, 4).map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Activity className="h-4 w-4" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{entry.title}</span>
                  {entry.description && <span className="text-xs text-muted-foreground">{entry.description}</span>}
                  <span className="text-xs text-muted-foreground">{formatRelative(entry.createdAt)}</span>
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
