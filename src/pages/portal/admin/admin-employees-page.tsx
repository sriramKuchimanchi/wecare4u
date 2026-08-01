import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminEmployeesQuery, useApproveEmployeeMutation, useSuspendEmployeeMutation } from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

const verifBadge: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 border border-green-200',
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  rejected: 'bg-red-100 text-red-700 border border-red-200',
  suspended: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const availBadge: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  busy: 'bg-amber-100 text-amber-700',
  emergency_duty: 'bg-red-100 text-red-700 font-bold animate-pulse',
  offline: 'bg-gray-100 text-gray-600',
  on_leave: 'bg-blue-100 text-blue-700',
};

export const AdminEmployeesPage = () => {
  const { employeeFilters, setEmployeeFilters } = useAdminStore();
  const [search, setSearch] = useState('');
  const [verifFilter, setVerifFilter] = useState('all');

  const { data: employees = [], isLoading, refetch } = useAdminEmployeesQuery(employeeFilters);
  const approveMutation = useApproveEmployeeMutation();
  const suspendMutation = useSuspendEmployeeMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployeeFilters({ search, verificationStatus: verifFilter });
  };

  const handleApprove = async (id: string) => {
    await approveMutation.mutateAsync(id);
    refetch();
  };

  const handleSuspend = async (id: string) => {
    await suspendMutation.mutateAsync(id);
    refetch();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
              <icons.Briefcase className="h-4 w-4" /> Administrator Portal
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">Employee Management</h1>
            <p className="text-sm text-white/80 mt-1">{employees.length} healthcare & service employees platform-wide</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees, roles, providers..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button type="submit" size="sm" className="bg-primary text-white">Search</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {['all', 'approved', 'pending', 'suspended'].map((s) => (
            <button
              key={s}
              onClick={() => { setVerifFilter(s); setEmployeeFilters({ verificationStatus: s, search }); }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-colors',
                verifFilter === s ? 'bg-primary text-white border-primary' : 'bg-surface text-muted-foreground border-border hover:border-primary'
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Table */}
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Availability</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verification</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp: any) => (
                  <tr key={emp.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {emp.avatarUrl ? (
                          <img src={emp.avatarUrl} alt={emp.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-sm shrink-0">
                            {emp.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground text-xs">{emp.providerName ?? 'Independent'}</p>
                      <p className="text-2xs text-muted-foreground">{emp.contact?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {emp.experience ?? 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-2xs font-semibold capitalize', availBadge[emp.availability ?? 'available'])}>
                        {emp.availability?.replace('_', ' ') ?? 'available'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-2xs font-semibold capitalize', verifBadge[emp.verificationStatus ?? 'approved'])}>
                        {emp.verificationStatus ?? 'approved'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {emp.verificationStatus === 'pending' && (
                          <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 text-2xs h-7 px-2" onClick={() => handleApprove(emp.id)} disabled={approveMutation.isPending}>
                            <icons.CheckCircle className="h-3 w-3 mr-1" /> Approve
                          </Button>
                        )}
                        {emp.verificationStatus === 'approved' && (
                          <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 text-2xs h-7 px-2" onClick={() => handleSuspend(emp.id)} disabled={suspendMutation.isPending}>
                            <icons.AlertTriangle className="h-3 w-3 mr-1" /> Suspend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {employees.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <icons.Briefcase className="h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">No employees found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEmployeesPage;
