import { Siren } from '@/config/icons';
import { useEmergencyStore } from '@/store';
import { cn } from '@/lib/utils';

export const FloatingEmergencyButton = () => {
  const setConfirmationOpen = useEmergencyStore((s) => s.setConfirmationOpen);
  const activeSession = useEmergencyStore((s) => s.activeSession);

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
      {activeSession && (
        <span className="animate-pulse rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground shadow-lg">
          EMERGENCY ACTIVE
        </span>
      )}
      <button
        type="button"
        onClick={() => setConfirmationOpen(true)}
        className={cn(
          'group relative flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-floating transition-all hover:scale-105 active:scale-95 md:h-16 md:w-16',
          activeSession && 'ring-4 ring-destructive/40'
        )}
        aria-label="Emergency SOS"
        title="Emergency SOS"
      >
        <span className="absolute -inset-1 animate-ping rounded-full bg-destructive/30 opacity-75" />
        <Siren className="relative h-7 w-7 transition-transform group-hover:rotate-12 md:h-8 md:w-8" />
      </button>
    </div>
  );
};

export default FloatingEmergencyButton;
