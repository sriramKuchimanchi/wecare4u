import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ProviderSettingsPage = () => {
  const { toast } = useToast();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [autoAssignEmergency, setAutoAssignEmergency] = useState(true);

  const handleSave = () => {
    toast({ title: 'Settings Saved', description: 'Portal settings updated successfully.' });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Portal Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Configure system notifications, dispatch rules, and account preferences</p>
      </div>

      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-6 max-w-2xl">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.Bell className="h-5 w-5 text-primary" /> Dispatch & Notification Alerts
          </h2>

          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-semibold text-foreground">Email Notifications for New Requests</p>
              <p className="text-xs text-muted-foreground">Receive instant email alert whenever a family books care</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-semibold text-foreground">SMS & WhatsApp Urgent Alerts</p>
              <p className="text-xs text-muted-foreground">Receive high priority SMS for emergency SOS calls</p>
            </div>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={(e) => setSmsNotif(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-semibold text-foreground">Auto-Notify Available Nearest Staff</p>
              <p className="text-xs text-muted-foreground">Automatically broadcast emergency requests to on-duty staff</p>
            </div>
            <input
              type="checkbox"
              checked={autoAssignEmergency}
              onChange={(e) => setAutoAssignEmergency(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
};
