import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useAdminSettingsQuery, useUpdatePlatformSettingsMutation } from '@/hooks/use-portal-queries';

export const AdminSettingsPage = () => {
  const { data: settings, isLoading } = useAdminSettingsQuery();
  const updateMutation = useUpdatePlatformSettingsMutation();

  const [platformName, setPlatformName] = useState('We Care For You');
  const [supportEmail, setSupportEmail] = useState('support@wecare4you.app');
  const [supportPhone, setSupportPhone] = useState('+91 98000 00000');
  const [emergencyTarget, setEmergencyTarget] = useState(10);
  const [verifProviderReq, setVerifProviderReq] = useState(true);
  const [verifEmpReq, setVerifEmpReq] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      platformName,
      supportEmail,
      supportPhone,
      emergencyResponseTargetMinutes: emergencyTarget,
      verificationRequiredForProviders: verifProviderReq,
      verificationRequiredForEmployees: verifEmpReq,
      currencySymbol,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (isLoading || !settings) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          <icons.Settings className="h-4 w-4" /> System Configuration
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-foreground">Platform Global Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Branding, emergency dispatch parameters, verification mandates, and PWA options.</p>
      </div>

      {saved && (
        <div className="rounded-xl bg-green-100 border border-green-300 p-4 text-green-800 font-bold text-sm flex items-center gap-2 animate-fade-in-up">
          <icons.CheckCircle2 className="h-5 w-5 text-green-600" /> Platform settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Branding */}
        <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-foreground text-base border-b border-border/40 pb-3 flex items-center gap-2">
            <icons.Globe className="h-5 w-5 text-primary" /> Platform Identity & Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Platform Name</label>
              <input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Currency Symbol</label>
              <input
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Support Email</label>
              <input
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Support Hotline</label>
              <input
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Emergency & Verification Rules */}
        <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-foreground text-base border-b border-border/40 pb-3 flex items-center gap-2">
            <icons.Siren className="h-5 w-5 text-red-600" /> Emergency & Verification Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Emergency Response Target (Minutes)</label>
              <input
                type="number"
                value={emergencyTarget}
                onChange={(e) => setEmergencyTarget(Number(e.target.value))}
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-3 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifProviderReq}
                  onChange={(e) => setVerifProviderReq(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs font-semibold text-foreground">Mandatory Provider Verification</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifEmpReq}
                  onChange={(e) => setVerifEmpReq(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs font-semibold text-foreground">Mandatory Employee License Check</span>
              </label>
            </div>
          </div>
        </div>

        {/* PWA & System Features */}
        <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-foreground text-base border-b border-border/40 pb-3 flex items-center gap-2">
            <icons.Smartphone className="h-5 w-5 text-indigo-600" /> Progressive Web App (PWA) & Offline Sync
          </h2>

          <div className="flex flex-wrap gap-6 text-xs font-semibold text-foreground">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" /> PWA Installability Enabled
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" /> Offline Field Data Caching
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" /> Background Push Notifications
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-primary text-white font-bold px-8 py-3 text-sm" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <icons.Loader2 className="h-4 w-4 animate-spin mr-2" /> : <icons.Save className="h-4 w-4 mr-2" />}
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
