import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminProvidersQuery, useApproveProviderMutation, useRejectProviderMutation, useSuspendProviderMutation } from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

const verifBadge: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 border border-green-200',
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  rejected: 'bg-red-100 text-red-700 border border-red-200',
  suspended: 'bg-gray-100 text-gray-600 border border-gray-200',
  under_review: 'bg-blue-100 text-blue-700 border border-blue-200',
};

export const ProvidersPage = () => {
  const navigate = useNavigate();
  const { providerFilters, setProviderFilters } = useAdminStore();
  const [search, setSearch] = useState('');
  const [verifFilter, setVerifFilter] = useState('all');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: providers = [], isLoading, refetch } = useAdminProvidersQuery(providerFilters);
  const approveMutation = useApproveProviderMutation();
  const rejectMutation = useRejectProviderMutation();
  const suspendMutation = useSuspendProviderMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setProviderFilters({ search, verificationStatus: verifFilter });
  };

  const handleApprove = async (id: string) => {
    await approveMutation.mutateAsync(id);
    refetch();
  };

  const handleSuspend = async (id: string) => {
    await suspendMutation.mutateAsync(id);
    refetch();
  };

  const handleReject = async () => {
    if (!rejectId) return;
    await rejectMutation.mutateAsync({ id: rejectId, reason: rejectReason });
    setRejectId(null);
    setRejectReason('');
    refetch();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
              <icons.Building2 className="h-4 w-4" /> Administrator Portal
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">Service Providers</h1>
            <p className="text-sm text-white/80 mt-1">{providers.length} registered providers — manage verification & status</p>
          </div>
          <Button onClick={() => navigate('/portal/admin/verification')} className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold shadow-md text-sm">
            <icons.ShieldCheck className="mr-2 h-4 w-4" /> Verification Center
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search providers..." className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <Button type="submit" size="sm" className="bg-primary text-white">Search</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {['all', 'approved', 'pending', 'rejected', 'suspended'].map((s) => (
            <button key={s} onClick={() => { setVerifFilter(s); setProviderFilters({ verificationStatus: s, search }); }} className={cn('px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-colors', verifFilter === s ? 'bg-primary text-white border-primary' : 'bg-surface text-muted-foreground border-border hover:border-primary')}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Cards */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center"><icons.Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {providers.map((prov: any) => (
            <div key={prov.id} className="rounded-2xl bg-surface border border-border/60 shadow-xs p-5 hover:shadow-md transition-all">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* Logo/avatar */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-lg shrink-0">
                  {prov.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">{prov.name}</h3>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold capitalize', verifBadge[prov.verificationStatus ?? 'pending'])}>
                      {prov.verificationStatus ?? 'pending'}
                    </span>
                    {prov.isVerified && <icons.BadgeCheck className="h-4 w-4 text-green-600" />}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize mb-2">{prov.type?.replace('-', ' ')} · {prov.address?.city}, {prov.address?.state}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><icons.Users className="h-3 w-3" />{prov.employeeCount} staff</span>
                    <span className="flex items-center gap-1"><icons.Star className="h-3 w-3 text-amber-500" />{prov.rating ?? 'N/A'}</span>
                    <span className="flex items-center gap-1"><icons.ClipboardList className="h-3 w-3" />{prov.totalRequestsCount} requests</span>
                    <span className="flex items-center gap-1"><icons.FileText className="h-3 w-3" />{prov.documentsCount} docs</span>
                  </div>
                  {prov.rejectionReason && (
                    <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                      <span className="font-bold">Rejection:</span> {prov.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/portal/admin/providers/${prov.id}`)}>
                    <icons.Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                  {prov.verificationStatus === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 text-xs" onClick={() => handleApprove(prov.id)} disabled={approveMutation.isPending}>
                        <icons.CheckCircle className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 text-xs" onClick={() => setRejectId(prov.id)}>
                        <icons.XCircle className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {prov.verificationStatus === 'approved' && (
                    <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 text-xs" onClick={() => handleSuspend(prov.id)} disabled={suspendMutation.isPending}>
                      <icons.AlertTriangle className="h-3 w-3 mr-1" /> Suspend
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-background border border-border p-6 shadow-2xl max-w-md w-full mx-4">
            <h3 className="font-bold text-foreground mb-2">Reject Provider</h3>
            <p className="text-sm text-muted-foreground mb-4">Please provide a reason for rejection. This will be sent to the provider.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={3}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setRejectId(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={handleReject} disabled={!rejectReason.trim() || rejectMutation.isPending}>
                {rejectMutation.isPending ? <icons.Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvidersPage;
