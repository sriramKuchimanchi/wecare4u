import { useState } from 'react';
import { MapPin, Loader2 } from '@/config/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type LocationPermissionDialogProps = {
  open: boolean;
  onDone: () => void;
};

/**
 * Shown once, right after a fresh sign-up completes, before the new
 * dashboard opens. Requesting location up front lets emergency dispatch
 * and "nearest provider" matching work without an interruption later.
 */
export const LocationPermissionDialog = ({ open, onDone }: LocationPermissionDialogProps) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllow = () => {
    if (!('geolocation' in navigator)) {
      onDone();
      return;
    }
    setIsRequesting(true);
    navigator.geolocation.getCurrentPosition(
      () => { setIsRequesting(false); onDone(); },
      () => { setIsRequesting(false); onDone(); },
      { timeout: 8000 },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onDone(); }}>
      <DialogContent className="text-center sm:text-center" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
            <MapPin className="h-7 w-7" />
          </div>
          <DialogTitle className="text-lg font-bold">Enable location access</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            We use your location to dispatch the nearest emergency responders and match you with care providers close by. You can change this anytime in settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={handleAllow} disabled={isRequesting} className="w-full">
            {isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Allow location access
          </Button>
          <Button variant="outline" onClick={onDone} disabled={isRequesting} className="w-full">
            Not now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermissionDialog;
