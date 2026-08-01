import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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

  const { data: families = [], isLoading } = useAdminFamiliesQuery(
    { search: familyFilters.search, status: familyFilters.status }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFamilyFilters({ search, status: statusFilter });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
            <icons.Users className="h-4 w-4" /> Administrator Portal
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">Family Management</h1>
          <p className="text-sm text-white/80 mt-1">{families.length} registered families on the platform</p>
        </div>
        <Button className="bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-md text-sm">
          <icons.Plus className="mr-2 h-4 w-4" /> Add Family
        </Button>
      </div>

      {/* Filters */}
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
              onClick={() => { setStatusFilter(s); setFamilyFilters({ status: s, search }); }}
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

      {/* Table */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-surface shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Family</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Members</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Req.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {families.map((family: any) => (
                  <tr key={family.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                          {family.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{family.name}</p>
                          <p className="text-xs text-muted-foreground">{family.contact?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{family.primaryContactName}</p>
                      <p className="text-xs text-muted-foreground">{family.contact?.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <icons.Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-foreground">{family.members?.length ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {family.address?.city}, {family.address?.state}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', family.activeRequestsCount > 0 ? 'bg-sky-100 text-sky-700' : 'bg-muted text-muted-foreground')}>
                        {family.activeRequestsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold capitalize', statusColors[family.status ?? 'active'])}>
                        {family.status ?? 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/portal/admin/families/${family.id}`)}>
                          <icons.Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <icons.Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <icons.History className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {families.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <icons.Users className="h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">No families found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamiliesPage;
