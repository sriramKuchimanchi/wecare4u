import { useLocation, useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminEmergencyQuery } from '@/hooks/use-portal-queries';

const workflowOrder = [
  { step: 'sos_triggered', label: 'SOS Triggered', icon: icons.Siren },
  { step: 'location_detected', label: 'GPS Received', icon: icons.MapPin },
  { step: 'coordinator_activated', label: 'AI Coordinator Activated', icon: icons.Brain },
  { step: 'provider_found', label: 'Provider Assigned', icon: icons.Building2 },
  { step: 'professional_assigned', label: 'Employee Assigned', icon: icons.UserCheck },
  { step: 'ambulance_assigned', label: 'Ambulance Assigned', icon: icons.Ambulance },
  { step: 'hospital_notified', label: 'Hospital Notified', icon: icons.Building2 },
  { step: 'contacts_notified', label: 'Medicine Arranged', icon: icons.Pill },
  { step: 'resolved', label: 'Resolved', icon: icons.CheckCircle2 },
];

export const EmergencyDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const id = segments[segments.length - 1];

  const { data: emergency, isLoading } = useAdminEmergencyQuery(id);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!emergency) {
    return <div className="text-center py-12 text-muted-foreground">Emergency record not found.</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/portal/admin/emergency')}>
          <icons.ArrowLeft className="h-4 w-4 mr-1" /> Emergency Center
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold text-foreground">{emergency.memberName} SOS Log</span>
      </div>

      <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
            <icons.Siren className="h-4 w-4" /> Live Emergency Incident
          </div>
          <h1 className="text-2xl md:text-3xl font-black mt-1 text-foreground">{emergency.memberName} — Incident #{emergency.id}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Triggered {new Date(emergency.createdAt).toLocaleString()} · Status: <span className="font-bold uppercase underline text-foreground">{emergency.status}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {emergency.status === 'active' && (
            <Button className="bg-red-600 text-white hover:bg-red-700 font-bold text-sm">
              <icons.PhoneCall className="mr-2 h-4 w-4" /> Call Family Contact
            </Button>
          )}
        </div>
      </div>

      {/* Live Workflow Timeline */}
      <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <icons.Activity className="h-5 w-5 text-primary" /> Live Emergency Workflow Progress
        </h2>

        {/* Step Flow Visualization */}
        <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
          {workflowOrder.map(({ step, label, icon: Icon }) => {
            const stepDetail = emergency.steps?.find((s: any) => s.step === step);
            const isDone = stepDetail?.status === 'completed';
            const isInProgress = stepDetail?.status === 'in-progress';

            return (
              <div key={step} className="flex items-start gap-4 relative z-10">
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all',
                  isDone ? 'bg-green-600 text-white shadow-md' :
                  isInProgress ? 'bg-red-600 text-white animate-bounce shadow-lg ring-4 ring-red-200' :
                  'bg-muted text-muted-foreground'
                )}>
                  {isDone ? <icons.Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>

                <div className="flex-1 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center justify-between">
                    <h3 className={cn('font-bold text-sm', isDone ? 'text-green-700 dark:text-green-400' : isInProgress ? 'text-red-600 font-extrabold' : 'text-muted-foreground')}>
                      {label}
                    </h3>
                    {stepDetail?.completedAt && (
                      <span className="text-2xs text-muted-foreground font-mono">
                        {new Date(stepDetail.completedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stepDetail?.description ?? 'Pending automated execution...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDetailPage;
