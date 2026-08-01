import { useLocation, useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminProviderQuery, useApproveProviderMutation, useSuspendProviderMutation } from '@/hooks/use-portal-queries';

const verifBadge: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-gray-100 text-gray-600',
};

export const ProviderDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const id = segments[segments.length - 1];

  const { data: provider, isLoading, refetch } = useAdminProviderQuery(id);
  const approveMutation = useApproveProviderMutation();
  const suspendMutation = useSuspendProviderMutation();

  if (isLoading) return <div className="flex h-96 items-center justify-center"><icons.Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!provider) return <div className="text-center py-12 text-muted-foreground">Provider not found.</div>;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/portal/admin/providers')}><icons.ArrowLeft className="h-4 w-4 mr-1" /> Providers</Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold text-foreground truncate">{provider.name}</span>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold shrink-0">{provider.name.charAt(0)}</div>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl font-extrabold">{provider.name}</h1>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold capitalize bg-white/20 text-white border border-white/30')}>{provider.verificationStatus}</span>
              {provider.isVerified && <icons.BadgeCheck className="h-5 w-5 text-green-300" />}
            </div>
            <p className="text-white/80 text-sm capitalize mt-1">{provider.type?.replace('-', ' ')} · {provider.address?.city}, {provider.address?.state}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/70">
              <span><icons.Phone className="h-3 w-3 inline mr-1" />{provider.contact?.phone}</span>
              <span><icons.Mail className="h-3 w-3 inline mr-1" />{provider.contact?.email}</span>
              <span><icons.Star className="h-3 w-3 inline mr-1 text-amber-300" />{provider.rating ?? 'N/A'} ({provider.reviewCount ?? 0} reviews)</span>
            </div>
          </div>
          <div className="flex gap-2 sm:flex-col">
            {provider.verificationStatus === 'pending' && (
              <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm" onClick={() => { approveMutation.mutateAsync(id); refetch(); }} disabled={approveMutation.isPending}>
                <icons.CheckCircle className="h-4 w-4 mr-1" /> Approve
              </Button>
            )}
            {provider.verificationStatus === 'approved' && (
              <Button className="bg-white/20 text-white hover:bg-white/30 border border-white/40 font-semibold text-sm" onClick={() => { suspendMutation.mutateAsync(id); refetch(); }} disabled={suspendMutation.isPending}>
                <icons.AlertTriangle className="h-4 w-4 mr-1" /> Suspend
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Employees', value: provider.employeeCount, icon: icons.Users, color: 'bg-blue-100 text-blue-600' },
          { label: 'Active Requests', value: provider.activeRequestsCount, icon: icons.Activity, color: 'bg-sky-100 text-sky-600' },
          { label: 'Total Requests', value: provider.totalRequestsCount, icon: icons.ClipboardList, color: 'bg-indigo-100 text-indigo-600' },
          { label: 'Documents', value: provider.documentsCount, icon: icons.FileText, color: 'bg-violet-100 text-violet-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl bg-surface border border-border/60 p-4 shadow-xs">
            <div className={cn('h-8 w-8 flex items-center justify-center rounded-lg mb-2', color)}><Icon className="h-4 w-4" /></div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Services */}
      {provider.services?.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border/60 shadow-xs p-5">
          <h2 className="font-bold text-foreground mb-3">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {provider.services.map((s: string) => (
              <span key={s} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Employees */}
      {provider.employees?.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="font-bold text-foreground">Staff Members</h2>
          </div>
          <div className="divide-y divide-border/40">
            {provider.employees.map((emp: any) => (
              <div key={emp.id} className="px-5 py-3 flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">{emp.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.role}</p>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold capitalize', verifBadge[emp.verificationStatus ?? 'pending'])}>{emp.verificationStatus ?? 'pending'}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', emp.availability === 'available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>{emp.availability}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {provider.documents?.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="font-bold text-foreground">Uploaded Documents</h2>
          </div>
          <div className="divide-y divide-border/40">
            {provider.documents.map((doc: any) => (
              <div key={doc.id} className="px-5 py-3 flex items-center gap-4">
                <icons.FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold capitalize',
                  doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                  doc.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                )}>{doc.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {provider.reviews?.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="font-bold text-foreground">Reviews ({provider.reviews.length})</h2>
          </div>
          <div className="divide-y divide-border/40">
            {provider.reviews.slice(0, 5).map((rev: any) => (
              <div key={rev.id} className="px-5 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{rev.reviewerName}</span>
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <icons.Star key={i} className={cn('h-3 w-3', i < rev.rating ? 'text-amber-400' : 'text-muted')} />)}</div>
                </div>
                <p className="text-xs text-muted-foreground">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDetailPage;
