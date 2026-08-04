import { CheckCircle2 } from '@/config/icons';
import { cn } from '@/lib/utils';
import type { LucideIcon } from '@/config/icons';

export type ProgressTrackerStep = {
  key: string;
  label: string;
  description?: string;
  timestamp?: string;
  icon?: LucideIcon;
};

type ProgressTrackerProps = {
  steps: ProgressTrackerStep[];
  /** Index of the step currently in progress. Earlier steps render as done, later ones as upcoming. */
  currentIndex: number;
  className?: string;
};

/**
 * Read-only vertical timeline for multi-stage workflows (care requests, emergency
 * dispatch). There is deliberately no interaction here — whoever owns the underlying
 * status (the provider, the dispatch system) updates it; this only ever displays it.
 */
export const ProgressTracker = ({ steps, currentIndex, className }: ProgressTrackerProps) => (
  <div className={cn('flex flex-col', className)}>
    {steps.map((step, idx) => {
      const isDone = idx < currentIndex;
      const isCurrent = idx === currentIndex;
      const isLast = idx === steps.length - 1;
      const Icon = step.icon;

      return (
        <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
          {!isLast && (
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px transition-colors duration-500',
                isDone ? 'bg-primary/40' : 'bg-border'
              )}
            />
          )}
          <span
            className={cn(
              'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
              isDone && 'bg-primary text-primary-foreground',
              isCurrent && 'bg-secondary text-secondary-foreground shadow-[0_0_0_5px_hsl(var(--secondary)/0.15)]',
              !isDone && !isCurrent && 'bg-muted text-muted-foreground/50'
            )}
          >
            {isCurrent && (
              <span className="absolute inset-0 animate-ping rounded-full bg-secondary/40" />
            )}
            <span className="relative">
              {isDone ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : Icon ? (
                <Icon className="h-3.5 w-3.5" />
              ) : (
                <span className="block h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>
          </span>

          <div className="flex flex-1 flex-col gap-0.5 pt-1">
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={cn(
                  'text-sm font-semibold',
                  isCurrent ? 'text-foreground' : isDone ? 'text-foreground/80' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
              {step.timestamp && (
                <span className="shrink-0 text-2xs tabular-nums text-muted-foreground">{step.timestamp}</span>
              )}
            </div>
            {step.description && (
              <span className={cn('text-xs leading-snug', isCurrent ? 'text-muted-foreground' : 'text-muted-foreground/70')}>
                {step.description}
              </span>
            )}
            {isCurrent && (
              <span className="mt-1.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-2xs font-bold uppercase tracking-wide text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> In progress
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default ProgressTracker;
