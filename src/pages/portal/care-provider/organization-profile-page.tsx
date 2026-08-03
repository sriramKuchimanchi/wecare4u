import { useState, useEffect } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProviderOrgProfileQuery, useUpdateOrgProfileMutation } from '@/hooks/use-portal-queries';
import type { OrganizationProfile } from '@/types';
import { AppAvatar } from '@/components/shared';

export const OrganizationProfilePage = () => {
  const { toast } = useToast();
  const { data: orgProfile, isLoading } = useProviderOrgProfileQuery();
  const updateMutation = useUpdateOrgProfileMutation();

  const [formData, setFormData] = useState<OrganizationProfile | null>(null);

  useEffect(() => {
    if (orgProfile) {
      setFormData({ ...orgProfile });
    }
  }, [orgProfile]);

  if (isLoading || !formData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      toast({
        title: 'Profile Updated',
        description: 'Organization profile and verification credentials updated.',
      });
    } catch {
      toast({ title: 'Error', description: 'Failed to update organization profile.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organization Profile</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Verified health provider profile, registration credentials & business address</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Verification Banner */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AppAvatar
              src={formData.logoUrl}
              name={formData.name}
              fallbackType="building"
              className="h-16 w-16 rounded-2xl border-2 border-primary/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{formData.name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-2xs font-bold text-emerald-600 border border-emerald-500/30">
                  <icons.CheckCircle2 className="h-3 w-3" /> Verified Provider
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Reg #: {formData.registrationNumber}</p>
            </div>
          </div>

          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending && <icons.Loader2 className="h-4 w-4 animate-spin" />}
            Save Profile Changes
          </Button>
        </div>

        {/* Organization Basic Info */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.Building2 className="h-5 w-5 text-primary" /> Basic Organization Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Organization Legal Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Registration Number</label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, registrationNumber: e.target.value } : null))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">GST / TRN Tax Number</label>
              <Input
                value={formData.gstNumber || ''}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, gstNumber: e.target.value } : null))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Website Domain</label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, website: e.target.value } : null))}
              />
            </div>
          </div>
        </div>

        {/* Contact & Address */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.MapPin className="h-5 w-5 text-primary" /> Contact & Business Location
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Main Phone Number</label>
              <Input
                value={formData.contact.phone}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, contact: { ...prev.contact, phone: e.target.value } } : null))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Official Email Address</label>
              <Input
                value={formData.contact.email || ''}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, contact: { ...prev.contact, email: e.target.value } } : null))}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-foreground mb-1 block">Physical Address</label>
              <Input
                value={formData.address.line1}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, address: { ...prev.address, line1: e.target.value } } : null))}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
