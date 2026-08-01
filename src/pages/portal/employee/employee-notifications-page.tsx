import { icons } from '@/config/icons';
import { useEmployeeDashboardQuery } from '@/hooks/use-portal-queries';

export const EmployeeNotificationsPage = () => {
  const { data: dashboard, isLoading } = useEmployeeDashboardQuery('emp_1');

  if (isLoading || !dashboard) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { notifications } = dashboard;

  return (
    <div className="space-y-6 pb-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Field Notifications & Alerts</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Alerts on new assignments, emergency dispatches and schedule changes</p>
      </div>

      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
        <div className="divide-y divide-border/60">
          {notifications.map((n) => (
            <div key={n.id} className="py-4 flex items-start gap-4 text-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <icons.Bell className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">{n.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{n.message}</p>
                <span className="text-2xs text-muted-foreground block pt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
