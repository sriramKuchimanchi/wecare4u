import { icons } from '@/config/icons';
import { cn } from '@/lib/utils';
import { useAdminAnalyticsQuery } from '@/hooks/use-portal-queries';

const BarChartVisual = ({ data, keyName, valName, color = 'bg-primary' }: any) => {
  const max = Math.max(...data.map((d: any) => d[valName]), 1);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2 h-36 border-b border-border pb-2">
        {data.map((d: any, i: number) => {
          const pct = (d[valName] / max) * 100;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
              <span className="text-2xs font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {d[valName]}
              </span>
              <div
                style={{ height: `${Math.max(6, pct)}%` }}
                className={cn('w-full rounded-t-md opacity-90 transition-all hover:opacity-100', color)}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-2xs text-muted-foreground font-mono">
        {data.map((d: any, i: number) => (
          <span key={i} className="flex-1 text-center truncate">{d[keyName]}</span>
        ))}
      </div>
    </div>
  );
};

export const AdminAnalyticsPage = () => {
  const { data: analytics, isLoading } = useAdminAnalyticsQuery();

  if (isLoading || !analytics) {
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
          <icons.Activity className="h-4 w-4" /> Platform Business Intelligence
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-foreground">Platform Operations Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Growth metrics, care request volume, emergency response velocity, and top performer rosters.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-surface border border-border/60 p-4 shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Avg Emergency Response</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{analytics.avgResponseTimeMinutes} mins</p>
          <p className="text-2xs text-muted-foreground mt-0.5">Target: &lt; 10 mins</p>
        </div>

        <div className="rounded-xl bg-surface border border-border/60 p-4 shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Top Requested Service</p>
          <p className="text-xl font-bold text-foreground truncate mt-1">In-Home Nursing</p>
          <p className="text-2xs text-muted-foreground mt-0.5">210 requests logged</p>
        </div>

        <div className="rounded-xl bg-surface border border-border/60 p-4 shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Satisfaction Score</p>
          <p className="text-2xl font-black text-amber-500 mt-1">4.88 / 5.0</p>
          <p className="text-2xs text-muted-foreground mt-0.5">Based on 270 reviews</p>
        </div>

        <div className="rounded-xl bg-surface border border-border/60 p-4 shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Platform Health</p>
          <p className="text-2xl font-black text-blue-600 mt-1">99.4%</p>
          <p className="text-2xs text-muted-foreground mt-0.5">Uptime operational</p>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Care Request Trends */}
        <div className="rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <h3 className="font-bold text-foreground text-sm mb-4">Monthly Care Request Volume</h3>
          <BarChartVisual data={analytics.requestTrends} keyName="month" valName="total" color="bg-primary" />
        </div>

        {/* Emergency Trends */}
        <div className="rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <h3 className="font-bold text-foreground text-sm mb-4">Emergency Incident Volume</h3>
          <BarChartVisual data={analytics.emergencyTrends} keyName="month" valName="count" color="bg-red-500" />
        </div>

        {/* Category Usage */}
        <div className="rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <h3 className="font-bold text-foreground text-sm mb-4">Care Category Distribution</h3>
          <div className="space-y-3">
            {analytics.categoryUsage?.map((c: any) => (
              <div key={c.category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{c.category}</span>
                  <span className="text-muted-foreground font-semibold">{c.count} ({c.percentage}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings Distribution */}
        <div className="rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <h3 className="font-bold text-foreground text-sm mb-4">Rating Star Breakdown</h3>
          <div className="space-y-3">
            {analytics.ratingsDistribution?.map((r: any) => (
              <div key={r.rating} className="flex items-center gap-3">
                <span className="text-xs font-bold w-12 flex items-center gap-1 text-foreground">
                  {r.rating} <icons.Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                </span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${(r.count / 142) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right font-semibold">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Service Providers */}
        <div className="rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <h3 className="font-bold text-foreground text-sm mb-3">Top Service Providers</h3>
          <div className="divide-y divide-border/40">
            {analytics.topProviders?.map((p: any, idx: number) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-xs text-muted-foreground w-4">#{idx + 1}</span>
                  <span className="font-semibold text-sm text-foreground">{p.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-amber-600">
                    <icons.Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {p.rating}
                  </span>
                  <span className="text-muted-foreground">{p.requestCount} requests</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Employees */}
        <div className="rounded-2xl bg-surface border border-border/60 p-5 shadow-xs">
          <h3 className="font-bold text-foreground text-sm mb-3">Top Field Employees</h3>
          <div className="divide-y divide-border/40">
            {analytics.topEmployees?.map((e: any, idx: number) => (
              <div key={e.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-xs text-muted-foreground w-4">#{idx + 1}</span>
                  <span className="font-semibold text-sm text-foreground">{e.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-amber-600">
                    <icons.Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {e.rating}
                  </span>
                  <span className="text-muted-foreground">{e.completedCount} completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
