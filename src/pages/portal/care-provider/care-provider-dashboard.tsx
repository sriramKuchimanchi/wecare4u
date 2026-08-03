import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useProviderOverviewQuery, useProviderServicesQuery } from '@/hooks/use-portal-queries';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export const CareProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: overview, isLoading } = useProviderOverviewQuery();
  const { data: services = [] } = useProviderServicesQuery();

  // Read sub-categories selected during provider registration
  let registeredSubCategories: string[] = [];
  try {
    const saved = localStorage.getItem('provider_registered_services');
    if (saved) registeredSubCategories = JSON.parse(saved);
  } catch {
    // ignore
  }

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
            Real-time operational portal for care requests, service schedules and patient emergency alerts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            onClick={() => navigate('/portal/care-provider/requests')}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md text-sm"
          >
            <icons.ClipboardList className="mr-2 h-4 w-4 text-primary" /> Incoming Requests ({todayOverview.pendingCount})
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

      {/* My Services Card */}
      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              <icons.Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">My Services</h3>
              <p className="text-xs text-muted-foreground">Healthcare & assistance services offered by your organization</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/portal/care-provider/services')}>
            <icons.Settings className="mr-1.5 h-3.5 w-3.5 text-primary" /> Manage Services
          </Button>
        </div>

        {/* Services List / Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {registeredSubCategories.length > 0 ? (
            registeredSubCategories.map((subName) => (
              <div
                key={subName}
                className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs font-semibold text-primary transition-all hover:border-primary/40"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{subName}</span>
              </div>
            ))
          ) : null}

          {services.map((srv: any) => (
            <div
              key={srv.id}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all',
                srv.enabled !== false
                  ? 'border-border/60 bg-muted/20 text-foreground'
                  : 'border-border/40 bg-muted/10 text-muted-foreground opacity-60'
              )}
            >
              <span className={cn('h-2 w-2 rounded-full', srv.enabled !== false ? 'bg-emerald-500' : 'bg-gray-400')} />
              <span>{srv.name}</span>
              {srv.price && <span className="text-2xs font-bold text-muted-foreground ml-1">({srv.currency ?? '₹'}{srv.price})</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Middle Grid: Revenue & Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
