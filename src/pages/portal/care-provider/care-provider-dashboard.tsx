import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useProviderOverviewQuery } from '@/hooks/use-portal-queries';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export const CareProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: overview, isLoading } = useProviderOverviewQuery();

  if (isLoading || !overview) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { todayOverview, employeeStats, revenueSummary, ratingSummary, recentNotifications } = overview;
  const orgName = user?.name ?? 'Service Provider Portal';

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-primary to-primary-hover p-6 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-primary-foreground/80 text-xs font-semibold uppercase tracking-wider">
            <icons.Building2 className="h-4 w-4" /> Operational Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">{orgName}</h1>
          <p className="text-sm text-primary-foreground/90 mt-1 max-w-xl">
            Real-time operational portal for care requests, staff dispatching, service schedules and patient emergency alerts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            onClick={() => navigate('/portal/care-provider/requests')}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md text-sm"
          >
            <icons.ClipboardList className="mr-2 h-4 w-4 text-primary" /> Incoming Requests ({todayOverview.pendingCount})
          </Button>
          <Button
            onClick={() => navigate('/portal/care-provider/employees')}
            className="bg-white/20 text-white hover:bg-white/30 border border-white/40 font-semibold text-sm backdrop-blur-xs"
          >
            <icons.Users className="mr-2 h-4 w-4" /> Manage Employees
          </Button>
        </div>
      </div>

      {/* Today's Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div
          onClick={() => navigate('/portal/care-provider/requests')}
          className="group cursor-pointer rounded-2xl bg-surface p-5 border border-border/60 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Requests</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <icons.Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{todayOverview.pendingCount}</span>
            <span className="text-xs font-medium text-amber-600">Needs Action</span>
          </div>
          <p className="mt-1 text-2xs text-muted-foreground">Accept or assign available staff</p>
        </div>

        {/* Active Requests */}
        <div
          onClick={() => navigate('/portal/care-provider/requests')}
          className="group cursor-pointer rounded-2xl bg-surface p-5 border border-border/60 shadow-xs hover:border-sky-500/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Requests</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
              <icons.Activity className="h-5 w-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{todayOverview.activeCount}</span>
            <span className="text-xs font-medium text-sky-600">In Field</span>
          </div>
          <p className="mt-1 text-2xs text-muted-foreground">Staff en-route or in service</p>
        </div>

        {/* Completed Requests */}
        <div
          onClick={() => navigate('/portal/care-provider/requests')}
          className="group cursor-pointer rounded-2xl bg-surface p-5 border border-border/60 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <icons.CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{todayOverview.completedCount}</span>
            <span className="text-xs font-medium text-emerald-600">Today</span>
          </div>
          <p className="mt-1 text-2xs text-muted-foreground">Successful care deliveries</p>
        </div>

        {/* Total Today's Overview */}
        <div className="rounded-2xl bg-surface p-5 border border-border/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Scheduled</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <icons.CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{todayOverview.todayCount}</span>
            <span className="text-xs font-medium text-muted-foreground">Visits</span>
          </div>
          <p className="mt-1 text-2xs text-muted-foreground">Total bookings logged today</p>
        </div>
      </div>

      {/* Middle Grid: Employees & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employees Operational Status */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Staff Availability</h3>
              <p className="text-xs text-muted-foreground">Field employees availability breakdown</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/portal/care-provider/employees')}>
              View All <icons.ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-bold mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                Available Staff
              </div>
              <span className="text-3xl font-black text-emerald-700">{employeeStats.availableCount}</span>
              <p className="text-2xs text-muted-foreground mt-1">Ready for assignment</p>
            </div>

            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-600 text-xs font-bold mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Busy / Offline
              </div>
              <span className="text-3xl font-black text-amber-700">{employeeStats.unavailableCount}</span>
              <p className="text-2xs text-muted-foreground mt-1">Currently on duty</p>
            </div>
          </div>

          <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Registered Care Professionals</span>
            <span className="font-bold text-foreground">{employeeStats.totalCount} Employees</span>
          </div>
        </div>

        {/* Revenue Summary (Mocked) */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Revenue Summary (Mock)</h3>
              <p className="text-xs text-muted-foreground">Earnings & financial performance</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <icons.DollarSign className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">Total Completed Revenue</span>
              <div className="text-3xl font-black text-foreground mt-0.5">
                {revenueSummary.totalRevenue.toLocaleString()} <span className="text-sm font-semibold text-muted-foreground">{revenueSummary.currency}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div>
                <span className="text-2xs text-muted-foreground">This Month</span>
                <p className="text-base font-bold text-foreground">₹{revenueSummary.thisMonthEarnings.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-3 border border-border/40">
                <span className="text-2xs font-semibold text-muted-foreground block uppercase">Pending Payout</span>
                <p className="text-base font-bold text-amber-600">₹{revenueSummary.pendingPayout.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Customer Sentiment */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Ratings & Reviews</h3>
              <p className="text-xs text-muted-foreground">Family feedback score</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/portal/care-provider/reviews')}>
              Reviews <icons.ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <span className="text-2xl font-black">{ratingSummary.overallRating}</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-secondary">
                {[...Array(5)].map((_, i) => (
                  <icons.Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Based on {ratingSummary.totalReviews} verified reviews</p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground flex items-center gap-2 border">
            <icons.Award className="h-4 w-4 text-secondary shrink-0" />
            Top-Rated Home Healthcare Service Provider in Dubai
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Notifications Feed */}
      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <icons.Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Recent Activity & Notifications</h3>
              <p className="text-xs text-muted-foreground">Live updates on care requests & dispatching</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/portal/care-provider/requests')}>
            Manage Requests
          </Button>
        </div>

        <div className="divide-y divide-border/60">
          {recentNotifications.map((notif) => (
            <div key={notif.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white',
                    notif.type === 'warning' ? 'bg-amber-500' : notif.type === 'success' ? 'bg-emerald-500' : 'bg-primary'
                  )}
                >
                  <icons.BellRing className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{notif.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                </div>
              </div>
              <span className="text-2xs text-muted-foreground whitespace-nowrap">
                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
