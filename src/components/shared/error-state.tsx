import { forwardRef } from 'react';
import { AlertCircle, RefreshCw } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    { title = 'Something went wrong', message = 'Please try again in a moment.', onRetry, className },
    ref,
  ) => (
    <div ref={ref} className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  ),
);
ErrorState.displayName = 'ErrorState';
