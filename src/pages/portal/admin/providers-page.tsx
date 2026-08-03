import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table';
import {
  useAdminProvidersQuery,
  useAdminEmployeesQuery,
  useApproveProviderMutation,
  useRejectProviderMutation,
  useSuspendProviderMutation,
  useApproveEmployeeMutation,
} from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

const verifBadge: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 border border-green-200',
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  rejected: 'bg-red-100 text-red-700 border border-red-200',
  suspended: 'bg-gray-100 text-gray-600 border border-gray-200',
  under_review: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const availBadge: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  busy: 'bg-amber-100 text-amber-700',
  emergency_duty: 'bg-red-100 text-red-700 font-bold animate-pulse',
  offline: 'bg-gray-100 text-gray-600',
  on_leave: 'bg-blue-100 text-blue-700',
};

type CombinedRow = {
  id: string;
  type: 'provider' | 'employee';
  name: string;
  organization: string;
  role: string;
  location: string;
  status: string;
  availability?: string;
  providerId?: string;
  employeeCount?: number;
};

export const ProvidersPage = () => {
  const navigate = useNavigate();
  const { providerFilters, setProviderFilters } = useAdminStore();
  const [search, setSearch] = useState(providerFilters.search ?? '');
  const [verifFilter, setVerifFilter] = useState(providerFilters.verificationStatus ?? 'all');
  const [page, setPage] = useState(1);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const pageSize = 8;

  const { data: providers = [], isLoading: providersLoading, refetch: refetchProviders } = useAdminProvidersQuery(providerFilters);
  const { data: employees = [], isLoading: employeesLoading, refetch: refetchEmployees } = useAdminEmployeesQuery({ search: providerFilters.search, verificationStatus: providerFilters.verificationStatus });

  const approveProviderMutation = useApproveProviderMutation();
  const rejectMutation = useRejectProviderMutation();
  const suspendMutation = useSuspendProviderMutation();
  const approveEmployeeMutation = useApproveEmployeeMutation();

  const combined = useMemo<CombinedRow[]>(() => {
    const providerRows = providers.map((prov: any) => ({
      id: prov.id,
      type: 'provider' as const,
      name: prov.name,
      organization: prov.type?.replace('-', ' ') ?? 'Provider',
      role: `${prov.employeeCount ?? 0} staff`,
      location: `${prov.address?.city ?? ''}, ${prov.address?.state ?? ''}`.trim(),
      status: prov.verificationStatus ?? 'pending',
    }));

    const employeeRows = employees.map((emp: any) => ({
      id: emp.id,
      type: 'employee' as const,
      name: emp.name,
      organization: emp.providerName ?? 'Independent',
      role: emp.role,
      location: `${emp.address?.city ?? ''}, ${emp.address?.state ?? ''}`.trim(),
      status: emp.verificationStatus ?? 'approved',
      availability: emp.availability ?? 'available',
      providerId: emp.providerId,
    }));

    const merged = [...providerRows, ...employeeRows];
    const q = (search || providerFilters.search || '').toLowerCase();
    const status = verifFilter || providerFilters.verificationStatus || 'all';

    return merged.filter((item) => {
      const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.organization.toLowerCase().includes(q) || item.role.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
      const matchesStatus = status === 'all' || item.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [providers, employees, search, verifFilter, providerFilters.search, providerFilters.verificationStatus]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return combined.slice(start, start + pageSize);
  }, [combined, page]);

  const totalPages = Math.max(1, Math.ceil(combined.length / pageSize));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setProviderFilters({ search, verificationStatus: verifFilter });
    setPage(1);
  };

  const handleApproveProvider = async (id: string) => {
    await approveProviderMutation.mutateAsync(id);
    refetchProviders();
  };

  const handleSuspendProvider = async (id: string) => {
    await suspendMutation.mutateAsync(id);
    refetchProviders();
  };

  const handleApproveEmployee = async (id: string) => {
    await approveEmployeeMutation.mutateAsync(id);
    refetchEmployees();
  };

  const handleReject = async () => {
    if (!rejectId) return;
    await rejectMutation.mutateAsync({ id: rejectId, reason: rejectReason });
    setRejectId(null);
    setRejectReason('');
    refetchProviders();
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="rounded-2xl border border-border/60 bg-surface p-4 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <icons.Building2 className="h-4 w-4" /> Service Providers
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Service Providers</h1>
            <p className="mt-1 text-sm text-muted-foreground">All registered providers and active platform staff in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/portal/admin/providers')}>
              <icons.Building2 className="mr-2 h-4 w-4" /> Providers
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/portal/admin/notifications')}>
              <icons.Bell className="mr-2 h-4 w-4" /> Notifications
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search provider, employee, organization..." className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <Button type="submit" size="sm" className="bg-primary text-white">Search</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {['all', 'approved', 'pending', 'rejected', 'suspended'].map((s) => (
            <button key={s} onClick={() => { setVerifFilter(s); setProviderFilters({ verificationStatus: s, search }); setPage(1); }} className={cn('px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-colors', verifFilter === s ? 'bg-primary text-white border-primary' : 'bg-surface text-muted-foreground border-border hover:border-primary')}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (row: CombinedRow) => (
              <div className="flex items-center gap-3">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm shrink-0', row.type === 'provider' ? 'bg-indigo-100 text-indigo-700' : 'bg-violet-100 text-violet-700')}>
                  {row.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.type === 'provider' ? 'Provider' : 'Employee'}</p>
                </div>
              </div>
            ),
          },
          { key: 'organization', header: 'Organization', render: (row: CombinedRow) => <span className="text-sm font-medium">{row.organization}</span> },
          { key: 'role', header: 'Role / Type', render: (row: CombinedRow) => <span className="text-xs text-muted-foreground">{row.role}</span> },
          { key: 'location', header: 'Location', render: (row: CombinedRow) => <span className="text-xs text-muted-foreground">{row.location || '—'}</span> },
          {
            key: 'status',
            header: 'Verification',
            render: (row: CombinedRow) => (
              <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize border', verifBadge[row.status ?? 'pending'])}>
                {row.status}
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            className: 'text-right',
            render: (row: CombinedRow) => (
              <div className="flex items-center justify-end gap-2">
                {row.type === 'provider' ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/portal/admin/providers/${row.id}`)}>
                      <icons.Eye className="h-3 w-3" />
                    </Button>
                    {row.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 text-2xs h-7 px-2" onClick={() => handleApproveProvider(row.id)} disabled={approveProviderMutation.isPending}>
                          <icons.CheckCircle className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 text-2xs h-7 px-2" onClick={() => setRejectId(row.id)}>
                          <icons.XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {row.status === 'approved' && (
                      <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 text-2xs h-7 px-2" onClick={() => handleSuspendProvider(row.id)} disabled={suspendMutation.isPending}>
                        <icons.AlertTriangle className="h-3 w-3 mr-1" /> Suspend
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {row.status === 'pending' && (
                      <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 text-2xs h-7 px-2" onClick={() => handleApproveEmployee(row.id)}>
                        <icons.CheckCircle className="h-3 w-3 mr-1" /> Approve
                      </Button>
                    )}
                    {row.status === 'approved' && (
                      <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 text-2xs h-7 px-2" onClick={() => handleApproveEmployee(row.id)}>
                        <icons.AlertTriangle className="h-3 w-3 mr-1" /> Suspend
                      </Button>
                    )}
                    {row.availability && (
                      <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize', availBadge[row.availability])}>{row.availability.replace('_', ' ')}</span>
                    )}
                  </>
                )}
              </div>
            ),
          },
        ]}
        data={pagedRows}
        isLoading={providersLoading || employeesLoading}
        page={page}
        pageSize={pageSize}
        total={combined.length}
        totalPages={totalPages}
        onPageChange={(next) => setPage(next)}
        emptyTitle="No service providers or staff found"
        emptyDescription="Try another search keyword or reset the status filter."
        rowKey={(row: CombinedRow) => `${row.type}-${row.id}`}
      />

      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-background border border-border p-6 shadow-2xl max-w-md w-full mx-4">
            <h3 className="font-bold text-foreground mb-2">Reject Provider</h3>
            <p className="text-sm text-muted-foreground mb-4">Please provide a reason for rejection. This will be sent to the provider.</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={3} placeholder="Enter rejection reason..." />
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setRejectId(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={handleReject} disabled={!rejectReason.trim() || rejectMutation.isPending}>{rejectMutation.isPending ? <icons.Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Reject'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvidersPage;
