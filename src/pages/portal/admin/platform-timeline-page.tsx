import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminTimelineQuery } from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

const activityBadge: Record<string, string> = {
  sos_triggered: 'bg-red-500 text-white',
  emergency_resolved: 'bg-green-600 text-white',
  provider_approved: 'bg-blue-600 text-white',
  care_requested: 'bg-sky-500 text-white',
  request_completed: 'bg-emerald-500 text-white',
  review_submitted: 'bg-amber-500 text-white',
  family_registered: 'bg-purple-500 text-white',
  provider_registered: 'bg-indigo-500 text-white',
  employee_verified: 'bg-teal-500 text-white',
  document_uploaded: 'bg-slate-600 text-white',
};

export const PlatformTimelinePage = () => {
  const { timelineFilters, setTimelineFilters } = useAdminStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: timelineData, isLoading } = useAdminTimelineQuery({
    search: timelineFilters.search,
    type: timelineFilters.type,
    page,
    pageSize: 10,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTimelineFilters({ search });
    setPage(1);
  };

  const activities = timelineData?.data ?? [];
  const totalPages = Math.ceil((timelineData?.total ?? 0) / 10);

  return (
    <div className="space-y-5 pb-8">
      <div className="rounded-2xl border border-border/60 bg-surface p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <icons.History className="h-4 w-4" /> Global Audit Trail
        </div>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Platform Activity Timeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">Chronological log of every event across the platform.</p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search timeline events, actors, or descriptions..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <Button type="submit" size="sm" className="bg-primary text-white">Search Audit Log</Button>
      </form>

      {/* Timeline Stream */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs">
          <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {activities.map((act: any) => {
              const badgeClass = activityBadge[act.type] ?? 'bg-primary text-white';

              return (
                <div key={act.id} className="flex items-start gap-4 relative z-10">
                  <div className={cn('h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs', badgeClass)}>
                    <icons.Activity className="h-5 w-5" />
                  </div>

                  <div className="flex-1 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-sm text-foreground">{act.title}</h3>
                      <span className="text-2xs text-muted-foreground font-mono">
                        {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>

                    {act.actorName && (
                      <p className="text-2xs text-muted-foreground/80 mt-2 font-medium">
                        Actor: <span className="text-foreground font-semibold">{act.actorName}</span> ({act.actorRole})
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlatformTimelinePage;
