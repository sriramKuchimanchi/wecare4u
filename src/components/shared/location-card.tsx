import { useEffect } from 'react';
import { MapPin, RefreshCw } from '@/config/icons';
import { useLocationStore } from '@/store';
import { cn } from '@/lib/utils';

/**
 * Minimal, always-visible "where I am" strip shown above the dashboard
 * greeting. Reflects the location captured the last time the user booked
 * care for themselves (see the Request Care wizard's location step).
 */
export const LocationCard = ({ className }: { className?: string }) => {
  const location = useLocationStore((s) => s.location);
  const isLoading = useLocationStore((s) => s.isLoading);
  const refresh = useLocationStore((s) => s.refresh);

  useEffect(() => {
    if (!location) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-2.5', className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin className="h-4 w-4" />
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-2xs font-medium uppercase tracking-wide text-muted-foreground">Current Location</span>
          <span className="truncate text-sm font-semibold text-foreground">
            {location
              ? [...new Set([location.address, location.city].filter(Boolean))].join(', ')
              : isLoading ? 'Detecting…' : 'Location not set'}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => refresh()}
        disabled={isLoading}
        aria-label="Refresh location"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
      </button>
    </div>
  );
};

export default LocationCard;
