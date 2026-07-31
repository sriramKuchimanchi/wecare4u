import { forwardRef } from 'react';
import type { LucideIcon } from '@/config/icons';
import { formatRelative } from '@/utils/date';
import { cn } from '@/lib/utils';

type NotificationTone = 'info' | 'success' | 'warning' | 'error';

const toneAccent: Record<NotificationTone, string> = {
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
};

export type NotificationItemProps = {
  title: string;
  message: string;
  timestamp?: string;
  read?: boolean;
  tone?: NotificationTone;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
};

export const NotificationItem = forwardRef<HTMLButtonElement, NotificationItemProps>(
  (
    { title, message, timestamp, read = false, tone = 'info', icon: Icon, onClick, className },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/60',
        !read && 'bg-primary/[0.04]',
        className,
      )}
    >
      <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', read ? 'bg-transparent' : toneAccent[tone])} />
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('text-sm font-semibold', !read && 'text-foreground')}>{title}</p>
          {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{message}</p>
        {timestamp && (
          <time className="text-xs text-muted-foreground">{formatRelative(timestamp)}</time>
        )}
      </div>
    </button>
  ),
);
NotificationItem.displayName = 'NotificationItem';
