import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table';
import { useAdminFamiliesQuery } from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  flagged: 'bg-red-100 text-red-700',
};

export const FamiliesPage = () => {
  const navigate = useNavigate();
  const { familyFilters, setFamilyFilters } = useAdminStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { data: families = [], isLoading } = useAdminFamiliesQuery({
    search: familyFilters.search,
    status: familyFilters.status,
  });

  const pagedFamilies = useMemo(() => {
    const start = (page - 1) * pageSize;
    return families.slice(start, start + pageSize);
  }, [families, page]);

  const totalPages = Math.max(1, Math.ceil(families.length / pageSize));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFamilyFilters({ search, status: statusFilter });
    setPage(1);
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-border/60 bg-surface p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <icons.Users className="h-4 w-4" /> Family Management
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Families</h1>
          <p className="mt-1 text-sm text-muted-foreground">{families.length} registered families on the platform</p>
        </div>
        <Button variant="outline" size="sm" className="self-start">
          <icons.Plus className="mr-2 h-4 w-4" /> Add Family
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search families, contacts..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button type="submit" size="sm" className="bg-primary text-white">Search</Button>
        </form>
        <div className="flex gap-2">
          {['all', 'active', 'inactive', 'flagged'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setFamilyFilters({ status: s, search }); setPage(1); }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-colors',
                statusFilter === s ? 'bg-primary text-white border-primary' : 'bg-surface text-muted-foreground border-border hover:border-primary'
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Family',
            render: (row: any) => (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">{row.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.contact?.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'primaryContactName',
            header: 'Primary Contact',
            render: (row: any) => (
              <div>
                <p className="font-medium text-foreground">{row.primaryContactName}</p>
                <p className="text-xs text-muted-foreground">{row.contact?.phone}</p>
              </div>
            ),
          },
          { key: 'members', header: 'Members', render: (row: any) => <span className="font-semibold">{row.members?.length ?? 0}</span> },
          { key: 'location', header: 'Location', render: (row: any) => <span className="text-xs text-muted-foreground">{row.address?.city}, {row.address?.state}</span> },
          {
            key: 'activeRequestsCount',
            header: 'Active Req.',
            render: (row: any) => <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', row.activeRequestsCount > 0 ? 'bg-sky-100 text-sky-700' : 'bg-muted text-muted-foreground')}>{row.activeRequestsCount}</span>,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row: any) => <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', statusColors[row.status ?? 'active'])}>{row.status ?? 'active'}</span>,
          },
          {
            key: 'actions',
            header: 'Actions',
            className: 'text-right',
            render: (row: any) => (
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/portal/admin/families/${row.id}`)}>
                  <icons.Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <icons.Edit className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
        data={pagedFamilies}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={families.length}
        totalPages={totalPages}
        onPageChange={(next) => setPage(next)}
        className="rounded-2xl"
        rowKey={(row: any) => row.id}
      />
    </div>
  );
};

export default FamiliesPage;
