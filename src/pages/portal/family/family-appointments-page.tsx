import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft } from '@/config/icons';
import { PageHeader, EmptyState, StatusIndicator } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/skeleton';
import { useAppointments } from '@/hooks/use-family-portal';
import { formatDate, formatTime } from '@/utils/date';
import type { AppointmentStatus } from '@/types';

const statusTone: Record<AppointmentStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  upcoming: 'success',
  completed: 'neutral',
  cancelled: 'error',
  rescheduled: 'warning',
};

export const FamilyAppointmentsPage = () => {
  const { data: appointments = [], isLoading } = useAppointments();
  const navigate = useNavigate();

  const sorted = [...appointments].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const upcoming = sorted.filter((a) => a.status === 'upcoming');
  const past = sorted.filter((a) => a.status !== 'upcoming');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Appointments"
        description="All scheduled and past care visits"
        actions={<Button size="sm" onClick={() => navigate('/portal/family/request-care')}>Request Service</Button>}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <EmptyState
            icon={Calendar}
            title="No appointments"
            description="Request care to schedule your first appointment."
            action={<Button size="sm" onClick={() => navigate('/portal/family/request-care')}>Request Service</Button>}
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Upcoming</h2>
              {upcoming.map((apt) => (
                <Card key={apt.id} className="flex items-center gap-3 p-4">
                  <span className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{apt.serviceType}</span>
                      <StatusIndicator label={apt.status} tone={statusTone[apt.status]} />
                    </div>
                    <span className="text-xs text-muted-foreground">{apt.providerName}</span>
                    {apt.location && <span className="text-xs text-muted-foreground">{apt.location}</span>}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">{formatDate(apt.scheduledAt, 'MMM d')}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(apt.scheduledAt)}</span>
                  </div>
                </Card>
              ))}
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Past</h2>
              {past.map((apt) => (
                <Card key={apt.id} className="flex items-center gap-3 p-4 opacity-80">
                  <span className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{apt.serviceType}</span>
                      <StatusIndicator label={apt.status} tone={statusTone[apt.status]} />
                    </div>
                    <span className="text-xs text-muted-foreground">{apt.providerName}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">{formatDate(apt.scheduledAt, 'MMM d')}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(apt.scheduledAt)}</span>
                  </div>
                </Card>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyAppointmentsPage;
