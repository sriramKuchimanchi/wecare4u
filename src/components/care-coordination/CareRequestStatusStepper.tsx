import { AlertCircle } from '@/config/icons';
import type { CareRequestStatus, CareRequestTimelineStep } from '@/types';
import { formatRelative } from '@/utils/date';
import { ProgressTracker } from './ProgressTracker';

export type StatusStep = {
  key: CareRequestStatus;
  label: string;
  description: string;
};

// The single canonical pipeline every dashboard (family, provider, admin)
// renders — there is no "assign an employee" step, since providers don't
// pick named staff for a request; they simply move it through these stages.
export const statusSteps: StatusStep[] = [
  { key: 'requested', label: 'Requested', description: 'Care request submitted' },
  { key: 'accepted', label: 'Accepted', description: 'Provider confirmed request' },
  { key: 'on_the_way', label: 'On The Way', description: 'Care professional travelling to location' },
  { key: 'arrived', label: 'Arrived', description: 'Care professional arrived at address' },
  { key: 'in_progress', label: 'In Progress', description: 'Care service being delivered' },
  { key: 'completed', label: 'Completed', description: 'Service completed successfully' },
];

type CareRequestStatusStepperProps = {
  currentStatus: CareRequestStatus;
  /** Per-step timestamps, sourced from the request's own timeline log. */
  timeline?: CareRequestTimelineStep[];
};

/**
 * Read-only status display for a family's care request. The provider is the
 * only one who ever moves this forward — see the care-provider portal's
 * request detail page for that control surface.
 */
export const CareRequestStatusStepper = ({ currentStatus, timeline }: CareRequestStatusStepperProps) => {
  const getStepIndex = (status: CareRequestStatus) => {
    if (status === 'cancelled') return -1;
    if (status === 'completed') return statusSteps.length;
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
    <ProgressTracker
      steps={statusSteps.map((s) => {
        const entry = timeline?.find((t) => t.status === s.key);
        return {
          key: s.key,
          label: s.label,
          description: s.description,
          timestamp: entry ? formatRelative(entry.timestamp) : undefined,
        };
      })}
      currentIndex={currentIndex}
    />
  );
};

export default CareRequestStatusStepper;
