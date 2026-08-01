import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from '@/hooks/use-portal-queries';

const notifIcon: Record<string, any> = {
  emergency: icons.Siren,
  verification: icons.ShieldCheck,
  system: icons.Settings,
  provider: icons.Building2,
  announcement: icons.Bell,
};

const notifColor: Record<string, string> = {
  critical: 'border-red-400 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300',
  high: 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300',
  medium: 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300',
  low: 'border-gray-200 bg-surface text-foreground',
};

export const AdminNotificationsPage = () => {
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: notifications = [], isLoading, refetch } = useAdminNotificationsQuery({ type: typeFilter });
  const readMutation = useMarkNotificationReadMutation();
  const readAllMutation = useMarkAllNotificationsReadMutation();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 p-6 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
            <icons.Bell className="h-4 w-4" /> Admin Operations
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">Notification Center</h1>
          <p className="text-sm text-white/80 mt-1">System alerts, emergency dispatches, provider verifications & announcements.</p>
        </div>

        <Button
          onClick={async () => { await readAllMutation.mutateAsync(); refetch(); }}
          className="bg-white text-purple-900 hover:bg-purple-50 font-bold shadow-md text-sm"
        >
          <icons.CheckCircle2 className="mr-2 h-4 w-4 text-purple-700" /> Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap border-b border-border gap-1 pb-1">
        {['all', 'emergency', 'verification', 'provider', 'system', 'announcement'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors capitalize',
              typeFilter === t ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n: any) => {
            const Icon = notifIcon[n.type] ?? icons.Bell;

            return (
              <div
                key={n.id}
                onClick={async () => { if (!n.read) { await readMutation.mutateAsync(n.id); refetch(); } }}
                className={cn(
                  'rounded-2xl border p-4 shadow-xs transition-all flex items-start gap-4 cursor-pointer',
                  notifColor[n.priority] ?? 'border-border/60 bg-surface',
                  !n.read && 'ring-2 ring-primary/30 font-medium'
                )}
              >
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                  n.priority === 'critical' ? 'bg-red-600 text-white animate-pulse' :
                  n.priority === 'high' ? 'bg-amber-500 text-white' : 'bg-primary/10 text-primary'
                )}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm text-foreground">{n.title}</h3>
                    <span className="text-2xs text-muted-foreground shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                </div>

                {!n.read && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <icons.Bell className="h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">No notifications in this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;
