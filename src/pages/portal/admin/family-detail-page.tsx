import { useLocation, useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminFamilyQuery } from '@/hooks/use-portal-queries';

export const FamilyDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const id = segments[segments.length - 1];

  const { data: family, isLoading } = useAdminFamilyQuery(id);

  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
      <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (!family) return <div className="text-center py-12 text-muted-foreground">Family not found.</div>;

  const bloodColors: Record<string, string> = { 'A+': 'bg-red-100 text-red-700', 'B+': 'bg-orange-100 text-orange-700', 'O+': 'bg-pink-100 text-pink-700', 'AB+': 'bg-purple-100 text-purple-700', 'A-': 'bg-red-100 text-red-700', 'B-': 'bg-orange-100 text-orange-700', 'O-': 'bg-pink-100 text-pink-700', 'AB-': 'bg-purple-100 text-purple-700' };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/portal/admin/families')}>
          <icons.ArrowLeft className="h-4 w-4 mr-1" /> Families
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold text-foreground">{family.name}</span>
      </div>

      <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {family.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-foreground">{family.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Primary Contact: {family.primaryContactName}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><icons.Phone className="h-3 w-3" />{family.contact?.phone}</span>
              <span className="flex items-center gap-1"><icons.Mail className="h-3 w-3" />{family.contact?.email}</span>
              <span className="flex items-center gap-1"><icons.MapPin className="h-3 w-3" />{family.address?.city}, {family.address?.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Members', value: family.members?.length ?? 0, icon: icons.Users, color: 'bg-blue-100 text-blue-600' },
          { label: 'Total Requests', value: family.careRequests?.length ?? 0, icon: icons.ClipboardList, color: 'bg-sky-100 text-sky-600' },
          { label: 'Emergencies', value: family.emergencies?.length ?? 0, icon: icons.Siren, color: 'bg-red-100 text-red-600' },
          { label: 'Status', value: 'active', icon: icons.CheckCircle, color: 'bg-green-100 text-green-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl bg-surface border border-border/60 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('h-8 w-8 flex items-center justify-center rounded-lg', color)}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground capitalize">{value}</p>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="font-bold text-foreground">Family Members</h2>
        </div>
        <div className="divide-y divide-border/40">
          {family.members?.map((mem: any) => (
            <div key={mem.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                {mem.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{mem.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{mem.relationship} · {mem.gender}</p>
                {mem.medicalConditions?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mem.medicalConditions.map((c: string) => (
                      <span key={c} className="text-2xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                )}
              </div>
              {mem.bloodGroup && (
                <span className={cn('text-xs font-bold px-2 py-1 rounded-lg', bloodColors[mem.bloodGroup] ?? 'bg-gray-100 text-gray-700')}>
                  {mem.bloodGroup}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Care Requests */}
      {family.careRequests?.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Care Requests</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/portal/admin/requests')} className="text-xs text-primary">View All</Button>
          </div>
          <div className="divide-y divide-border/40">
            {family.careRequests.slice(0, 5).map((req: any) => (
              <div key={req.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{req.categoryLabel ?? req.category}</p>
                  <p className="text-xs text-muted-foreground">{req.patientName} · {req.providerName}</p>
                </div>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize',
                  req.status === 'completed' ? 'bg-green-100 text-green-700' :
                  req.status === 'in_progress' ? 'bg-sky-100 text-sky-700' :
                  req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                )}>
                  {req.status?.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergencies */}
      {family.emergencies?.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <icons.Siren className="h-4 w-4 text-red-600" /> Emergency History
            </h2>
          </div>
          <div className="divide-y divide-border/40">
            {family.emergencies.map((em: any) => (
              <div key={em.id} className="px-5 py-3 flex items-center gap-3">
                <icons.Siren className={cn('h-4 w-4 shrink-0', em.status === 'active' ? 'text-red-600 animate-pulse' : 'text-muted-foreground')} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{em.memberName} Emergency</p>
                  <p className="text-xs text-muted-foreground">{em.assignedProvider?.name ?? 'Unassigned'}</p>
                </div>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', em.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                  {em.status}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/portal/admin/emergency/${em.id}`)}>
                  <icons.Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyDetailPage;
