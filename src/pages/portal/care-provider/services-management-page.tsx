import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProviderServicesQuery, useToggleServiceMutation, useUpdateServiceMutation } from '@/hooks/use-portal-queries';
import { cn } from '@/lib/utils';
import type { ProviderServiceItem } from '@/types';

export const ServicesManagementPage = () => {
  const { toast } = useToast();
  const { data: services = [], isLoading, refetch } = useProviderServicesQuery();

  const toggleMutation = useToggleServiceMutation();
  const updateMutation = useUpdateServiceMutation();

  const [editingService, setEditingService] = useState<ProviderServiceItem | null>(null);
  const [priceAmount, setPriceAmount] = useState<number>(0);
  const [priceUnit, setPriceUnit] = useState<string>('per visit');
  const [responseTime, setResponseTime] = useState<string>('30 mins');
  const [coverageArea, setCoverageArea] = useState<string>('All Dubai Areas');
  const [contactNumber, setContactNumber] = useState<string>('');

  const handleToggle = async (srv: ProviderServiceItem) => {
    try {
      await toggleMutation.mutateAsync(srv.id);
      toast({
        title: srv.enabled ? 'Service Disabled' : 'Service Enabled',
        description: `${srv.name} is now ${srv.enabled ? 'disabled' : 'enabled'}.`,
      });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to toggle service state.', variant: 'destructive' });
    }
  };

  const handleStartEdit = (srv: ProviderServiceItem) => {
    setEditingService(srv);
    setPriceAmount(srv.pricing.amount);
    setPriceUnit(srv.pricing.unit);
    setResponseTime(srv.responseTime);
    setCoverageArea(srv.coverageArea);
    setContactNumber(srv.contactNumber ?? '');
  };

  const handleSaveEdit = async () => {
    if (!editingService) return;
    try {
      await updateMutation.mutateAsync({
        id: editingService.id,
        patch: {
          pricing: { amount: priceAmount, unit: priceUnit, currency: '₹' },
          responseTime,
          coverageArea,
          contactNumber: contactNumber.trim() || undefined,
        },
      });
      toast({ title: 'Service Updated', description: 'Pricing and response time updated successfully.' });
      setEditingService(null);
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to update service details.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services Offered</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Enable/disable care services, configure pricing and response times</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((srv) => {
            const Icon = icons[srv.icon as keyof typeof icons] ?? icons.Stethoscope;
            return (
              <div
                key={srv.id}
                className={cn(
                  'rounded-2xl bg-surface p-5 border shadow-xs transition-all flex flex-col justify-between space-y-4',
                  srv.enabled ? 'border-border/60 hover:border-primary/40' : 'border-dashed border-border opacity-70 bg-muted/20'
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-xl font-bold',
                          srv.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{srv.name}</h3>
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {srv.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(srv)}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                        srv.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                          srv.enabled ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{srv.description}</p>

                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-3 text-xs border">
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Pricing</span>
                      <span className="font-bold text-foreground">
                        {srv.pricing.amount} {srv.pricing.currency} <span className="text-2xs font-normal text-muted-foreground">/{srv.pricing.unit}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Response ETA</span>
                      <span className="font-semibold text-emerald-600">{srv.responseTime}</span>
                    </div>

                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Coverage Zone</span>
                      <span className="font-semibold text-foreground truncate block">{srv.coverageArea}</span>
                    </div>

                    {srv.contactNumber && (
                      <div className="col-span-3 border-t border-border/60 pt-2">
                        <span className="text-2xs text-muted-foreground block font-medium">Contact Number</span>
                        <span className="font-semibold text-foreground">{srv.contactNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleStartEdit(srv)} className="text-xs">
                    <icons.Edit className="mr-1.5 h-3.5 w-3.5" /> Edit Pricing & Response
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Pricing Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-foreground">Edit Service Pricing & Details</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditingService(null)}>
                <icons.X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground mb-1 block">Service Name</label>
                <Input value={editingService.name} disabled className="bg-muted" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground mb-1 block">Price Amount (₹)</label>
                  <Input
                    type="number"
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground mb-1 block">Pricing Unit</label>
                  <Input
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    placeholder="e.g. per visit"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground mb-1 block">Estimated Response Time</label>
                <Input
                  value={responseTime}
                  onChange={(e) => setResponseTime(e.target.value)}
                  placeholder="e.g. 15-30 mins"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground mb-1 block">Coverage Area</label>
                <Input
                  value={coverageArea}
                  onChange={(e) => setCoverageArea(e.target.value)}
                  placeholder="e.g. All Dubai Areas"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground mb-1 block">Contact Number</label>
                <Input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. +91 98200 11223"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <Button variant="outline" onClick={() => setEditingService(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Service Configuration</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
