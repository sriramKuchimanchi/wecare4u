import { forwardRef } from 'react';
import type { LucideIcon } from '@/config/icons';
import { cn } from '@/lib/utils';

type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
  neutral: 'bg-muted text-muted-foreground',
};

const dotClasses: Record<StatusTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-info',
  neutral: 'bg-muted-foreground',
};

export type StatusIndicatorProps = {
  label: string;
  tone?: StatusTone;
  pulse?: boolean;
  icon?: LucideIcon;
  className?: string;
};

export const StatusIndicator = forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ label, tone = 'neutral', pulse = false, icon: Icon, className }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {Icon ? (
        <Icon className="h-3.5 w-3.5" />
      ) : (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', dotClasses[tone])} />
          )}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', dotClasses[tone])} />
        </span>
      )}
      <span>{label}</span>
    </span>
  ),
);
StatusIndicator.displayName = 'StatusIndicator';
