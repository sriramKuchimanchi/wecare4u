import { useMemo, useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table';
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
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const pageSize = 8;

  const { data: requests = [], isLoading } = useAdminCareRequestsQuery({
    search: requestFilters.search,
    status: activeTab,
  });

  const pagedRequests = useMemo(() => {
    const start = (page - 1) * pageSize;
    return requests.slice(start, start + pageSize);
  }, [requests, page]);

  const totalPages = Math.max(1, Math.ceil(requests.length / pageSize));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestFilters({ search, status: activeTab });
    setPage(1);
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
    <div className="space-y-5 pb-8">
      <div className="rounded-2xl border border-border/60 bg-surface p-4 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <icons.ClipboardList className="h-4 w-4" /> Care Requests Master Log
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Care Requests</h1>
            <p className="mt-1 text-sm text-muted-foreground">{requests.length} care requests tracked platform-wide</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap border-b border-border gap-1 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setRequestFilters({ status: t.id, search }); setPage(1); }}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors',
              activeTab === t.id ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

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

      <DataTable
        columns={[
          {
            key: 'categoryLabel',
            header: 'Request',
            render: (row: any) => (
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-foreground">{row.categoryLabel ?? row.category}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize', statusBadge[row.status ?? 'pending'])}>{row.status?.replace(/_/g, ' ')}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-[11px] capitalize', priorityBadge[row.priority ?? 'standard'])}>{row.priority ?? 'standard'}</span>
                </div>
                <p className="text-xs text-muted-foreground">{row.patientName} ({row.familyName})</p>
              </div>
            ),
          },
          { key: 'providerName', header: 'Provider', render: (row: any) => <span className="text-sm font-medium">{row.providerName ?? 'Unassigned Provider'}</span> },
          { key: 'employeeName', header: 'Assigned Staff', render: (row: any) => <span className="text-sm text-muted-foreground">{row.employeeName ?? '—'}</span> },
          { key: 'scheduledAt', header: 'Schedule', render: (row: any) => <span className="text-xs text-muted-foreground">{new Date(row.scheduledAt).toLocaleString()}</span> },
          { key: 'estimatedCost', header: 'Cost', render: (row: any) => <span className="font-bold">{row.currency ?? '₹'}{row.estimatedCost ?? 0}</span> },
          {
            key: 'actions',
            header: 'Action',
            className: 'text-right',
            render: (row: any) => (
              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(row)}>
                <icons.Eye className="mr-1 h-3 w-3" /> View
              </Button>
            ),
          },
        ]}
        data={pagedRequests}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={requests.length}
        totalPages={totalPages}
        onPageChange={(next) => setPage(next)}
        rowKey={(row: any) => row.id}
      />

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-background p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Care Request</p>
                <h3 className="text-lg font-bold text-foreground">{selectedRequest.categoryLabel ?? selectedRequest.category}</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-surface p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Patient</p>
                <p className="font-semibold text-foreground">{selectedRequest.patientName}</p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Family</p>
                <p className="font-semibold text-foreground">{selectedRequest.familyName}</p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Provider</p>
                <p className="font-semibold text-foreground">{selectedRequest.providerName ?? 'Unassigned Provider'}</p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Assigned Staff</p>
                <p className="font-semibold text-foreground">{selectedRequest.employeeName ?? '—'}</p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="font-semibold text-foreground capitalize">{selectedRequest.status?.replace(/_/g, ' ')}</p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Priority</p>
                <p className="font-semibold text-foreground capitalize">{selectedRequest.priority ?? 'standard'}</p>
              </div>
              <div className="rounded-lg bg-surface p-3 col-span-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Schedule</p>
                <p className="font-semibold text-foreground">{new Date(selectedRequest.scheduledAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareRequestsPage;
