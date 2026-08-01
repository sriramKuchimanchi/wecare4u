import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminCareRequestsQuery } from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

const statusBadge: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  employee_assigned: 'bg-indigo-100 text-indigo-700',
  on_the_way: 'bg-purple-100 text-purple-700',
  arrived: 'bg-violet-100 text-violet-700',
  in_progress: 'bg-sky-100 text-sky-700 font-semibold',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

const priorityBadge: Record<string, string> = {
  emergency: 'bg-red-100 text-red-700 font-bold animate-pulse',
  urgent: 'bg-amber-100 text-amber-700 font-semibold',
  standard: 'bg-slate-100 text-slate-700',
  scheduled: 'bg-blue-100 text-blue-700',
};

export const AdminCareRequestsPage = () => {
  const { requestFilters, setRequestFilters } = useAdminStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data: requests = [], isLoading } = useAdminCareRequestsQuery({
    search: requestFilters.search,
    status: activeTab,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestFilters({ search, status: activeTab });
  };

  const tabs = [
    { id: 'all', label: 'All Requests' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
              <icons.ClipboardList className="h-4 w-4" /> Admin Operations
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">Care Requests Master Log</h1>
            <p className="text-sm text-white/80 mt-1">{requests.length} care requests tracked platform-wide</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-border gap-1 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setRequestFilters({ status: t.id, search }); }}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors',
              activeTab === t.id
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {t.label}
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
            placeholder="Search patient, family, service provider, service..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <Button type="submit" size="sm" className="bg-primary text-white">Search</Button>
      </form>

      {/* List */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req: any) => (
            <div key={req.id} className="rounded-2xl border border-border/60 bg-surface p-5 shadow-xs hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-foreground text-base">{req.categoryLabel ?? req.category}</span>
                    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize', statusBadge[req.status ?? 'pending'])}>
                      {req.status?.replace(/_/g, ' ')}
                    </span>
                    <span className={cn('px-2.5 py-0.5 rounded-full text-xs capitalize', priorityBadge[req.priority ?? 'standard'])}>
                      {req.priority ?? 'standard'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{req.patientName}</span> ({req.familyName}) → <span className="font-medium text-foreground">{req.providerName ?? 'Unassigned Provider'}</span>
                  </p>
                  {req.employeeName && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <icons.UserCheck className="h-3.5 w-3.5 text-primary" /> Staff: {req.employeeName} ({req.employeeRole})
                    </p>
                  )}
                  {req.notes && (
                    <p className="text-xs text-muted-foreground/80 italic mt-1 line-clamp-1">"{req.notes}"</p>
                  )}
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <p className="text-lg font-extrabold text-foreground">{req.currency ?? '₹'}{req.estimatedCost ?? 0}</p>
                  <p className="text-2xs text-muted-foreground">{new Date(req.scheduledAt).toLocaleDateString()} {new Date(req.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <icons.ClipboardList className="h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">No care requests match this filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCareRequestsPage;
