import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminReviewsQuery, useFlagReviewMutation, useResolveReviewMutation } from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

export const AdminReviewsPage = () => {
  const { reviewFilters, setReviewFilters } = useAdminStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data: reviews = [], isLoading, refetch } = useAdminReviewsQuery({
    search: reviewFilters.search,
    status: activeTab,
  });

  const flagMutation = useFlagReviewMutation();
  const resolveMutation = useResolveReviewMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewFilters({ search, status: activeTab });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-amber-700 p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
          <icons.Star className="h-4 w-4" /> Platform Quality Control
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mt-1">Reviews & Complaints Moderation</h1>
        <p className="text-sm text-white/80 mt-1">Monitor patient satisfaction ratings, flagged complaints, and provider responses.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap border-b border-border gap-1 pb-1">
        {['all', 'pending', 'responded', 'flagged', 'resolved'].map((s) => (
          <button
            key={s}
            onClick={() => { setActiveTab(s); setReviewFilters({ status: s, search }); }}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors capitalize',
              activeTab === s ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by patient, provider, or comment text..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <Button type="submit" size="sm" className="bg-primary text-white">Search</Button>
      </form>

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev: any) => (
            <div key={rev.id} className={cn(
              'rounded-2xl border bg-surface p-5 shadow-xs transition-all',
              rev.isComplaint ? 'border-red-300 dark:border-red-900 bg-red-50/20' : 'border-border/60'
            )}>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-foreground text-sm">{rev.reviewerName}</span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <icons.Star key={i} className={cn('h-4 w-4', i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-muted')} />
                      ))}
                    </div>
                    {rev.isComplaint && (
                      <span className="bg-red-600 text-white text-2xs px-2 py-0.5 rounded-full font-bold uppercase">
                        COMPLAINT
                      </span>
                    )}
                    <span className={cn(
                      'text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize',
                      rev.status === 'flagged' ? 'bg-red-100 text-red-700' :
                      rev.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                    )}>
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Target: <span className="font-medium text-foreground">{rev.providerName}</span>
                    {rev.employeeName && <span> (Staff: {rev.employeeName})</span>}
                  </p>

                  <p className="text-sm text-foreground italic bg-muted/30 p-3 rounded-xl border border-border/40">
                    "{rev.comment}"
                  </p>

                  {rev.response && (
                    <div className="mt-2 text-xs bg-blue-50/80 border border-blue-200 p-3 rounded-xl dark:bg-blue-950/40 dark:border-blue-900">
                      <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">Provider Official Response:</p>
                      <p className="text-blue-800 dark:text-blue-200">"{rev.response.text}"</p>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                  {rev.status !== 'flagged' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
                      onClick={async () => { await flagMutation.mutateAsync(rev.id); refetch(); }}
                    >
                      <icons.Flag className="h-3.5 w-3.5 mr-1" /> Flag Review
                    </Button>
                  )}

                  {rev.status !== 'resolved' && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold"
                      onClick={async () => { await resolveMutation.mutateAsync(rev.id); refetch(); }}
                    >
                      <icons.CheckCircle className="h-3.5 w-3.5 mr-1" /> Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <icons.Star className="h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">No reviews match this filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
