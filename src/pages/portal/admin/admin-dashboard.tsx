import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminDashboardQuery } from '@/hooks/use-portal-queries';

const StatCard = ({ icon: Icon, label, value, color, sub, onClick }: any) => (
  <div
    onClick={onClick}
    className={cn(
      'group rounded-2xl bg-surface border border-border/60 p-5 shadow-xs hover:shadow-md transition-all',
      onClick && 'cursor-pointer hover:border-primary/40'
    )}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', color)}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="mt-4 flex items-baseline gap-2">
      <span className="text-3xl font-bold text-foreground">{value}</span>
      {sub && <span className="text-xs font-medium text-muted-foreground">{sub}</span>}
    </div>
  </div>
);

const MiniBar = ({ data, maxVal, color = 'bg-primary' }: { data: number[]; maxVal: number; color?: string }) => (
  <div className="flex items-end gap-1 h-12">
    {data.map((v, i) => (
      <div
        key={i}
        style={{ height: `${Math.max(8, (v / maxVal) * 100)}%` }}
        className={cn('flex-1 rounded-sm opacity-80 transition-all', color)}
      />
    ))}
  </div>
);

const ActivityItem = ({ item }: { item: any }) => {
  const severityColor = item.severity === 'critical' ? 'bg-red-500' : item.severity === 'warning' ? 'bg-amber-500' : 'bg-primary';
  const timeStr = (() => {
    const ms = Date.now() - new Date(item.createdAt).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <div className={cn('mt-1.5 h-2 w-2 rounded-full shrink-0', severityColor)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
      </div>
      <span className="text-2xs text-muted-foreground shrink-0 mt-1">{timeStr}</span>
    </div>
  );
};

const EmergencyFeedItem = ({ emergency }: { emergency: any }) => {
  const navigate = useNavigate();
  const stepsDone = emergency.steps.filter((s: any) => s.status === 'completed').length;
  const totalSteps = emergency.steps.length;
  const pct = Math.round((stepsDone / totalSteps) * 100);

  return (
    <div
      onClick={() => navigate(`/portal/admin/emergency/${emergency.id}`)}
      className="cursor-pointer rounded-xl border border-red-200 bg-red-50 p-4 hover:bg-red-100 transition-colors dark:bg-red-950/30 dark:border-red-900"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <icons.Siren className="h-4 w-4 text-red-600 animate-pulse" />
          <span className="text-sm font-bold text-red-700">{emergency.memberName ?? 'Unknown Patient'}</span>
        </div>
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">ACTIVE</span>
      </div>
      <p className="text-xs text-red-600 mb-2">
        {emergency.assignedProvider?.name ?? 'No provider yet'} •{' '}
        {emergency.assignedProfessional?.name ?? 'No employee'}
      </p>
      <div className="w-full bg-red-200 rounded-full h-1.5">
        <div className="bg-red-600 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-2xs text-red-500 mt-1">{stepsDone}/{totalSteps} steps complete</p>
    </div>
  );
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useAdminDashboardQuery();
  const [_tab, setTab] = useState<'activity' | 'emergency'>('activity');

  if (isLoading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const requestBarData = [12, 18, 24, 31, 38, 42, 50];
  const familyBarData = [1, 2, 3, 3, 4, 5, 5];

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-slate-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
              <icons.ShieldCheck className="h-4 w-4" /> Administrator Control Center
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">We Care For You — Administrator</h1>
            <p className="text-sm text-white/80 mt-1">
              Platform health: <span className="font-bold text-green-300">{stats.platformHealth}%</span>
              {stats.activeEmergencies > 0 && (
                <span className="ml-3 text-red-300 font-bold animate-pulse">
                  ● {stats.activeEmergencies} Active Emergency
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button
              onClick={() => navigate('/portal/admin/verification')}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md text-sm"
            >
              <icons.ShieldCheck className="mr-2 h-4 w-4 text-primary" />
              Verify ({stats.pendingActions.verifications})
            </Button>
            <Button
              onClick={() => navigate('/portal/admin/emergency')}
              className="bg-white/20 text-white hover:bg-white/30 border border-white/40 font-semibold text-sm"
            >
              <icons.Siren className="mr-2 h-4 w-4" /> Emergency Center
            </Button>
            <Button
              onClick={() => navigate('/portal/admin/analytics')}
              className="bg-white/20 text-white hover:bg-white/30 border border-white/40 font-semibold text-sm"
            >
              <icons.Activity className="mr-2 h-4 w-4" /> Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Active Emergency Alert */}
      {stats.activeEmergencies > 0 && (
        <div className="rounded-xl border-2 border-red-400 bg-red-50 dark:bg-red-950/30 p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 shrink-0">
            <icons.Siren className="h-5 w-5 text-red-600 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-red-700 dark:text-red-400">🚨 Active Emergency in Progress</p>
            <p className="text-sm text-red-600 dark:text-red-500">Ramachandra Sharma — Gokuldham Heights, Mumbai. Dr. Alok Gupta & ambulance dispatched.</p>
          </div>
          <Button onClick={() => navigate('/portal/admin/emergency')} className="shrink-0 bg-red-600 text-white hover:bg-red-700 font-bold text-sm">
            View Live
          </Button>
        </div>
      )}

      {/* Pending Actions Bar */}
      {(stats.pendingActions.verifications > 0 || stats.pendingActions.flaggedReviews > 0 || stats.pendingActions.pendingRequests > 0) && (
        <div className="grid grid-cols-3 gap-3">
          {stats.pendingActions.verifications > 0 && (
            <div onClick={() => navigate('/portal/admin/verification')} className="cursor-pointer rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3 hover:bg-amber-100 transition-colors">
              <icons.ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs text-amber-700 font-semibold">Pending Verifications</p>
                <p className="text-xl font-bold text-amber-800">{stats.pendingActions.verifications}</p>
              </div>
            </div>
          )}
          {stats.pendingActions.flaggedReviews > 0 && (
            <div onClick={() => navigate('/portal/admin/reviews')} className="cursor-pointer rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-3 hover:bg-red-100 transition-colors">
              <icons.Flag className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-xs text-red-700 font-semibold">Flagged Reviews</p>
                <p className="text-xl font-bold text-red-800">{stats.pendingActions.flaggedReviews}</p>
              </div>
            </div>
          )}
          {stats.pendingActions.pendingRequests > 0 && (
            <div onClick={() => navigate('/portal/admin/requests')} className="cursor-pointer rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 flex items-center gap-3 hover:bg-blue-100 transition-colors">
              <icons.ClipboardList className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs text-blue-700 font-semibold">Pending Requests</p>
                <p className="text-xl font-bold text-blue-800">{stats.pendingActions.pendingRequests}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI Stats Row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={icons.Users} label="Total Families" value={stats.totalFamilies} color="bg-blue-100 text-blue-600" onClick={() => navigate('/portal/admin/families')} />
        <StatCard icon={icons.Heart} label="Family Members" value={stats.totalFamilyMembers} color="bg-pink-100 text-pink-600" sub="registered" />
        <StatCard icon={icons.Building2} label="Service Providers" value={stats.totalProviders} color="bg-indigo-100 text-indigo-600" onClick={() => navigate('/portal/admin/providers')} />
        <StatCard icon={icons.Briefcase} label="Employees" value={stats.totalEmployees} color="bg-violet-100 text-violet-600" onClick={() => navigate('/portal/admin/employees')} />
      </div>

      {/* KPI Stats Row 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={icons.ShieldCheck} label="Pending Verif." value={stats.pendingProviderVerifications + stats.pendingEmployeeVerifications} color="bg-amber-100 text-amber-600" sub="providers + staff" onClick={() => navigate('/portal/admin/verification')} />
        <StatCard icon={icons.ClipboardList} label="Today's Requests" value={stats.todayCareRequests} color="bg-sky-100 text-sky-600" onClick={() => navigate('/portal/admin/requests')} />
        <StatCard icon={icons.Siren} label="Active Emerg." value={stats.activeEmergencies} color="bg-red-100 text-red-600" onClick={() => navigate('/portal/admin/emergency')} />
        <StatCard icon={icons.Star} label="Pending Reviews" value={stats.pendingReviews} color="bg-orange-100 text-orange-600" onClick={() => navigate('/portal/admin/reviews')} />
      </div>

      {/* Charts + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Trend Mini Chart */}
        <div className="col-span-1 lg:col-span-1 rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Care Requests (7 months)</h3>
            <icons.Activity className="h-4 w-4 text-primary" />
          </div>
          <MiniBar data={requestBarData} maxVal={55} color="bg-primary" />
          <div className="flex justify-between mt-2">
            <span className="text-2xs text-muted-foreground">Feb</span>
            <span className="text-2xs text-muted-foreground">Aug</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-semibold">
            <icons.ArrowUp className="h-3 w-3" /> 20% vs last month
          </div>
        </div>

        {/* Family Growth Mini Chart */}
        <div className="col-span-1 rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Family Growth (7 months)</h3>
            <icons.Users className="h-4 w-4 text-blue-500" />
          </div>
          <MiniBar data={familyBarData} maxVal={6} color="bg-blue-500" />
          <div className="flex justify-between mt-2">
            <span className="text-2xs text-muted-foreground">Feb</span>
            <span className="text-2xs text-muted-foreground">Aug</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-semibold">
            <icons.ArrowUp className="h-3 w-3" /> 5 families onboarded
          </div>
        </div>

        {/* Request Status Breakdown */}
        <div className="col-span-1 rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Request Status</h3>
            <icons.ClipboardList className="h-4 w-4 text-sky-500" />
          </div>
          <div className="space-y-2">
            {[
              { label: 'Active', val: stats.activeCareRequests, color: 'bg-sky-500', total: stats.todayCareRequests },
              { label: 'Completed', val: stats.completedCareRequests, color: 'bg-green-500', total: stats.todayCareRequests },
              { label: 'Emergency', val: stats.activeEmergencies, color: 'bg-red-500', total: stats.todayCareRequests },
            ].map(({ label, val, color, total }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-bold text-foreground">{val}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={cn('h-2 rounded-full transition-all', color)} style={{ width: `${total > 0 ? (val / total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Total: {stats.todayCareRequests} requests</div>
        </div>
      </div>

      {/* Activity Feed + Emergency Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground">Recent Platform Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/portal/admin/timeline')} className="text-xs text-primary">
              View All
            </Button>
          </div>
          <div>
            {stats.recentActivities?.map((act: any) => (
              <ActivityItem key={act.id} item={act} />
            ))}
          </div>
        </div>

        {/* Emergency Feed */}
        <div className="rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <icons.Siren className="h-4 w-4 text-red-600" /> Emergency Feed
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/portal/admin/emergency')} className="text-xs text-primary">
              Operations Center
            </Button>
          </div>
          {stats.activeEmergencyList?.length > 0 ? (
            <div className="space-y-3">
              {stats.activeEmergencyList.map((e: any) => (
                <EmergencyFeedItem key={e.id} emergency={e} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <icons.CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm font-medium">No Active Emergencies</p>
              <p className="text-xs mt-1">All clear — platform operating normally</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Grid */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Families', icon: icons.Users, path: '/portal/admin/families', color: 'text-blue-600 bg-blue-50' },
            { label: 'Providers', icon: icons.Building2, path: '/portal/admin/providers', color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Employees', icon: icons.Briefcase, path: '/portal/admin/employees', color: 'text-violet-600 bg-violet-50' },
            { label: 'Requests', icon: icons.ClipboardList, path: '/portal/admin/requests', color: 'text-sky-600 bg-sky-50' },
            { label: 'Emergency', icon: icons.Siren, path: '/portal/admin/emergency', color: 'text-red-600 bg-red-50' },
            { label: 'Analytics', icon: icons.Activity, path: '/portal/admin/analytics', color: 'text-green-600 bg-green-50' },
            { label: 'Settings', icon: icons.Settings, path: '/portal/admin/settings', color: 'text-gray-600 bg-gray-50' },
          ].map(({ label, icon: Icon, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={cn('flex flex-col items-center gap-2 rounded-xl border border-border/60 p-4 hover:shadow-md transition-all hover:scale-105', color.split(' ')[1])}
            >
              <Icon className={cn('h-6 w-6', color.split(' ')[0])} />
              <span className="text-xs font-semibold text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
