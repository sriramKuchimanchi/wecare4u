import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons, HandHeart, Plus, Eye, Search } from '@/config/icons';
import { PageHeader } from '@/components/shared';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCareRequests } from '@/hooks/use-family-portal';
import { formatDate, formatTime } from '@/utils/date';
import type { CareRequest } from '@/types';

const STATUS_TABS = [
  { id: 'all', label: 'All Requests' },
  { id: 'requested', label: 'Requested' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'in_progress', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const statusBadge: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
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

const PAGE_SIZE = 8;

export const FamilyRequestsPage = () => {
  const navigate = useNavigate();
  const { data: requests = [], isLoading } = useCareRequests();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Filter by tab + search query
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Tab filter
      if (activeTab !== 'all') {
        if (activeTab === 'in_progress') {
          if (!['in_progress', 'on_the_way', 'arrived'].includes(r.status)) return false;
        } else if (r.status !== activeTab) {
          return false;
        }
      }
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesCategory = (r.categoryLabel || r.category || '').toLowerCase().includes(q);
        const matchesProvider = (r.providerName || '').toLowerCase().includes(q);
        const matchesMember = (r.memberName || '').toLowerCase().includes(q);
        if (!matchesCategory && !matchesProvider && !matchesMember) return false;
      }
      return true;
    });
  }, [requests, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const pagedRequests = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRequests.slice(start, start + PAGE_SIZE);
  }, [filteredRequests, page]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setPage(1);
  };

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="My Requests"
        description="Track all your family care requests and their live progress"
        actions={
          <Button onClick={() => navigate('/portal/family/request-care')} className="bg-primary text-primary-foreground font-bold shadow-sm">
            <Plus className="mr-1.5 h-4 w-4" /> New Request
          </Button>
        }
      />

      {/* Search Input (Top, left-aligned, constrained width) */}
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search requests, providers..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Status Tabs (Below Search Bar) */}
      <div className="flex flex-wrap border-b border-border gap-1 pb-1">
        {STATUS_TABS.map((t) => {
          const count = t.id === 'all'
            ? requests.length
            : requests.filter((r) => {
                if (t.id === 'in_progress') return ['in_progress', 'on_the_way', 'arrived'].includes(r.status);
                return r.status === t.id;
              }).length;

          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={cn(
                'px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5',
                activeTab === t.id
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {t.label}
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-2xs font-bold min-w-[18px] text-center',
                activeTab === t.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Admin-Style DataTable */}
      <DataTable
        columns={[
          {
            key: 'categoryLabel',
            header: 'Request',
            render: (row: CareRequest) => (
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-foreground">{row.categoryLabel || row.category}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize', statusBadge[row.status] ?? 'bg-gray-100 text-gray-600')}>
                    {row.status.replace(/_/g, ' ')}
                  </span>
                  {row.priority && row.priority !== 'standard' && (
                    <span className={cn('px-2 py-0.5 rounded-full text-[11px] capitalize', priorityBadge[row.priority] ?? '')}>
                      {row.priority}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Member: {row.memberName || 'Family Member'}</p>
              </div>
            ),
          },
          {
            key: 'providerName',
            header: 'Provider',
            render: (row: CareRequest) => (
              <span className="text-sm font-medium text-foreground">
                {row.providerName || <span className="text-muted-foreground">—</span>}
              </span>
            ),
          },
          {
            key: 'address',
            header: 'Location',
            render: (row: CareRequest) => (
              <span className="text-sm text-muted-foreground">
                {row.address?.line1 ? `${row.address.line1}, ${row.address.city}` : '—'}
              </span>
            ),
          },
          {
            key: 'scheduledAt',
            header: 'Schedule',
            render: (row: CareRequest) => (
              <div className="flex flex-col text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{formatDate(row.scheduledAt, 'dd/MM/yyyy')}</span>
                <span>{formatTime(row.scheduledAt)}</span>
              </div>
            ),
          },
          {
            key: 'estimatedCost',
            header: 'Cost',
            render: (row: CareRequest) => (
              <span className="text-sm font-bold text-foreground">
                {row.currency || '₹'}{row.estimatedCost || 0}
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Action',
            className: 'text-right',
            render: (row: CareRequest) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/portal/family/care-requests/${row.id}`)}
              >
                <Eye className="mr-1 h-3 w-3" /> View
              </Button>
            ),
          },
        ]}
        data={pagedRequests as any}
        isLoading={isLoading}
        emptyTitle="No requests found"
        emptyDescription={activeTab === 'all' ? "You haven't submitted any care requests yet." : `No ${activeTab.replace('_', ' ')} requests match your search.`}
        page={page}
        pageSize={PAGE_SIZE}
        total={filteredRequests.length}
        totalPages={totalPages}
        onPageChange={(next) => setPage(next)}
        rowKey={(row: CareRequest) => row.id}
      />
    </div>
  );
};

export default FamilyRequestsPage;
