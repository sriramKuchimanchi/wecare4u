import { CheckCircle2, Clock, Truck, UserCheck, CheckCheck, FileText, AlertCircle } from '@/config/icons';
import type { CareRequestStatus } from '@/types';
import { cn } from '@/lib/utils';

export type StatusStep = {
  key: CareRequestStatus;
  label: string;
  description: string;
};

export const statusSteps: StatusStep[] = [
  { key: 'requested', label: 'Requested', description: 'Care request submitted' },
  { key: 'accepted', label: 'Accepted', description: 'Provider confirmed request' },
  { key: 'professional_assigned', label: 'Professional Assigned', description: 'Healthcare expert assigned' },
  { key: 'on_the_way', label: 'On The Way', description: 'Professional travelling to location' },
  { key: 'arrived', label: 'Arrived', description: 'Professional arrived at address' },
  { key: 'in_progress', label: 'In Progress', description: 'Care service being delivered' },
  { key: 'completed', label: 'Completed', description: 'Service completed successfully' },
];

export const CareRequestStatusStepper = ({ currentStatus }: { currentStatus: CareRequestStatus }) => {
  const getStepIndex = (status: CareRequestStatus) => {
    if (status === 'pending') return 0;
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
        <AlertCircle className="h-6 w-6 shrink-0" />
        <div className="flex flex-col">
          <span className="font-bold text-sm">Care Request Cancelled</span>
          <span className="text-xs opacity-90">This request was cancelled. You can create a new request anytime.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-4 right-4 top-1/2 -z-0 h-1 -translate-y-1/2 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${Math.max(0, (currentIndex / (statusSteps.length - 1)) * 100)}%` }}
          />
        </div>

        {statusSteps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                  isDone && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-secondary text-secondary-foreground ring-4 ring-secondary/20 scale-110',
                  !isDone && !isCurrent && 'bg-muted text-muted-foreground'
                )}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <span className={cn('mt-2 hidden text-center text-2xs font-semibold sm:block max-w-[70px]', isCurrent ? 'text-secondary' : isDone ? 'text-primary' : 'text-muted-foreground')}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Step Description Card */}
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CheckCheck className="h-5 w-5" />
        </span>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Current Status</span>
          <span className="text-sm font-bold text-foreground">
            {statusSteps[currentIndex]?.label ?? currentStatus}
          </span>
          <span className="text-xs text-muted-foreground">
            {statusSteps[currentIndex]?.description ?? 'Status active'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CareRequestStatusStepper;
