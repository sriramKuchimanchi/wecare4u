import { useState, useEffect } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProviderAvailabilityQuery, useUpdateAvailabilityMutation } from '@/hooks/use-portal-queries';
import type { AvailabilityConfig } from '@/types';
import { cn } from '@/lib/utils';

export const AvailabilityPage = () => {
  const { toast } = useToast();
  const { data: availability, isLoading } = useProviderAvailabilityQuery();
  const updateMutation = useUpdateAvailabilityMutation();

  const [config, setConfig] = useState<AvailabilityConfig | null>(null);

  useEffect(() => {
    if (availability) {
      setConfig({ ...availability });
    }
  }, [availability]);

  if (isLoading || !config) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(config);
      toast({
        title: 'Availability Saved',
        description: 'Business hours, emergency availability & coverage radius updated.',
      });
    } catch {
      toast({ title: 'Error', description: 'Failed to update availability.', variant: 'destructive' });
    }
  };

  const handleToggleEmergency = () => {
    setConfig((prev) => (prev ? { ...prev, emergencyAvailable: !prev.emergencyAvailable } : null));
  };

  const handleHourChange = (index: number, field: 'open' | 'close' | 'isClosed', value: string | boolean) => {
    setConfig((prev) => {
      if (!prev) return null;
      const updated = [...prev.businessHours];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, businessHours: updated };
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Availability & Coverage Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Set business operating hours, 24/7 emergency dispatch & service radius</p>
        </div>

        <Button onClick={handleSave} className="gap-2 shadow-sm" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <icons.Loader2 className="h-4 w-4 animate-spin" />}
          Save Availability Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Business Operating Hours */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.Clock className="h-5 w-5 text-primary" /> Weekly Business Operating Hours
            </h2>

            <div className="divide-y divide-border/60">
              {config.businessHours.map((dayItem, idx) => (
                <div key={dayItem.day} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-32 font-bold text-sm text-foreground flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!dayItem.isClosed}
                      onChange={(e) => handleHourChange(idx, 'isClosed', !e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>{dayItem.day}</span>
                  </div>

                  {dayItem.isClosed ? (
                    <span className="text-xs font-semibold text-muted-foreground italic">Closed / Restricted</span>
                  ) : (
                    <div className="flex items-center gap-2 text-xs">
                      <Input
                        type="time"
                        value={dayItem.open}
                        onChange={(e) => handleHourChange(idx, 'open', e.target.value)}
                        className="w-32 text-xs"
                      />
                      <span className="text-muted-foreground font-medium">to</span>
                      <Input
                        type="time"
                        value={dayItem.close}
                        onChange={(e) => handleHourChange(idx, 'close', e.target.value)}
                        className="w-32 text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Holiday Schedule */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.CalendarDays className="h-5 w-5 text-primary" /> Holiday & Special Days Schedule
            </h2>

            <div className="space-y-3">
              {config.holidaySchedule.map((hol, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border text-xs">
                  <div>
                    <span className="font-bold text-foreground">{hol.name}</span>
                    <p className="text-2xs text-muted-foreground">{hol.date}</p>
                  </div>
                  <span className="font-bold text-amber-600">
                    {hol.isClosed ? 'Closed' : 'Emergency Only'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Emergency & Coverage Radius */}
        <div className="space-y-6">
          {/* Emergency Availability Switch */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <icons.Siren className="h-5 w-5 text-red-500" /> Emergency SOS Dispatch
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Accept priority emergency dispatch requests 24/7</p>
              </div>

              <button
                onClick={handleToggleEmergency}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  config.emergencyAvailable ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                    config.emergencyAvailable ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-800 border border-emerald-500/20">
              ✓ Active: Your care team is registered for emergency auto-assignment.
            </div>
          </div>

          {/* Coverage Radius Slider */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.Compass className="h-5 w-5 text-primary" /> Service Coverage Radius
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Maximum Radius:</span>
                <span className="font-bold text-primary text-sm">{config.coverageRadiusKm} KM</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={config.coverageRadiusKm}
                onChange={(e) => setConfig((prev) => (prev ? { ...prev, coverageRadiusKm: Number(e.target.value) } : null))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-2xs text-muted-foreground">Bookings beyond {config.coverageRadiusKm} KM will be flagged as out-of-bounds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
