import { forwardRef } from 'react';
import type { LucideIcon } from '@/config/icons';
import { formatRelative } from '@/utils/date';
import { cn } from '@/lib/utils';

export type TimelineItemProps = {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: LucideIcon;
  tone?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  isLast?: boolean;
  className?: string;
};

const toneBg: Record<NonNullable<TimelineItemProps['tone']>, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  error: 'bg-destructive text-destructive-foreground',
  neutral: 'bg-muted text-muted-foreground',
};

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ title, description, timestamp, icon: Icon, tone = 'primary', isLast = false, className }, ref) => (
    <li ref={ref} className={cn('relative flex gap-4 pb-6', isLast && 'pb-0', className)}>
      {!isLast && (
        <span className="absolute left-[15px] top-8 bottom-0 w-px bg-border" aria-hidden />
      )}
      <span
        className={cn(
          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          toneBg[tone],
        )}
      >
        {Icon ? <Icon className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
      </span>
      <div className="flex flex-col gap-0.5 pt-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {timestamp && (
          <time className="text-xs text-muted-foreground">{formatRelative(timestamp)}</time>
        )}
      </div>
    </li>
  ),
);
TimelineItem.displayName = 'TimelineItem';
