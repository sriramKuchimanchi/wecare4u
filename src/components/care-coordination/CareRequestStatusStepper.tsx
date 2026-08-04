import { AlertCircle } from '@/config/icons';
import type { CareRequestStatus } from '@/types';
import { ProgressTracker } from './ProgressTracker';

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

/**
 * Read-only status display for a family's care request. The provider (or their
 * assigned staff) is the only one who ever moves this forward — see the
 * care-provider portal's request detail page for that control surface.
 */
export const CareRequestStatusStepper = ({ currentStatus }: { currentStatus: CareRequestStatus }) => {
  const getStepIndex = (status: CareRequestStatus) => {
    if (status === 'pending') return 0;
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
      steps={statusSteps.map((s) => ({ key: s.key, label: s.label, description: s.description }))}
      currentIndex={currentIndex}
    />
  );
};

export default CareRequestStatusStepper;
