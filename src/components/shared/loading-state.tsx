import { forwardRef } from 'react';
import type { LucideIcon } from '@/config/icons';
import { cn } from '@/lib/utils';

export type LoadingStateProps = {
  message?: string;
  icon?: LucideIcon;
  className?: string;
};

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ message = 'Loading…', icon: Icon, className }, ref) => (
    <div ref={ref} className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
      {Icon ? (
        <Icon className="h-6 w-6 animate-pulse text-muted-foreground" />
      ) : (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      )}
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  ),
);
LoadingState.displayName = 'LoadingState';
