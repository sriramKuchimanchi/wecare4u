import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table';
import { useAdminDashboardQuery, useAdminCareRequestsQuery } from '@/hooks/use-portal-queries';

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

const StatCard = ({ icon: Icon, label, value, color, onClick }: any) => (
  <div
    onClick={onClick}
    className={cn(
      'group flex items-center gap-3 rounded-xl border border-border/60 bg-surface px-3.5 py-3 shadow-xs transition-all hover:shadow-sm',
      onClick && 'cursor-pointer hover:border-primary/40'
    )}
  >
    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', color)}>
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div className="min-w-0">
      <p className="truncate text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xl font-bold leading-tight text-foreground">{value}</p>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const { data: stats, isLoading } = useAdminDashboardQuery();
  const { data: requests = [], isLoading: requestsLoading } = useAdminCareRequestsQuery({ status: activeTab, page: 1, pageSize: 10 });

  const recentRequests = useMemo(() => requests.slice(0, 5), [requests]);

  const tabs = [
    { id: 'all', label: 'All Bookings' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  if (isLoading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="rounded-2xl border border-border/60 bg-surface p-4 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <icons.ShieldCheck className="h-4 w-4" /> Administrator Control Center
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">We Care For You — Administrator</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Platform health: <span className="font-bold text-green-600">{stats.platformHealth}%</span>
              {stats.activeEmergencies > 0 && (
                <span className="ml-3 font-bold text-red-600 animate-pulse">● {stats.activeEmergencies} active emergency</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/portal/admin/bookings')}>
              <icons.ClipboardList className="mr-2 h-4 w-4" /> Bookings
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/portal/admin/emergency')}>
              <icons.Siren className="mr-2 h-4 w-4" /> Emergency Center
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:items-stretch">
        <div className="flex flex-col justify-center rounded-2xl border border-border/60 bg-surface p-3 shadow-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard icon={icons.Users} label="Families" value={stats.totalFamilies} color="bg-blue-100 text-blue-600" onClick={() => navigate('/portal/admin/families')} />
            <StatCard icon={icons.Building2} label="Providers & Staff" value={stats.totalProviders + stats.totalEmployees} color="bg-violet-100 text-violet-600" onClick={() => navigate('/portal/admin/providers')} />
            <StatCard icon={icons.ClipboardList} label="Bookings" value={stats.todayCareRequests} color="bg-sky-100 text-sky-600" onClick={() => navigate('/portal/admin/bookings')} />
            <StatCard icon={icons.Siren} label="Emergencies" value={stats.activeEmergencies} color="bg-red-100 text-red-600" onClick={() => navigate('/portal/admin/emergency')} />
            <StatCard icon={icons.ShieldCheck} label="Pending" value={stats.pendingProviderVerifications + stats.pendingEmployeeVerifications} color="bg-amber-100 text-amber-600" onClick={() => navigate('/portal/admin/providers')} />
            <StatCard icon={icons.Heart} label="Members" value={stats.totalFamilyMembers} color="bg-pink-100 text-pink-600" />
            <StatCard icon={icons.Bell} label="Notifications" value={stats.pendingActions.pendingRequests} color="bg-slate-100 text-slate-600" onClick={() => navigate('/portal/admin/notifications')} />
            <StatCard icon={icons.Star} label="Reviews" value={stats.pendingReviews} color="bg-orange-100 text-orange-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-surface p-3 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Emergency</p>
              <h2 className="text-sm font-bold text-foreground">In progress</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/portal/admin/emergency')}>
              View
            </Button>
          </div>

          <div className="space-y-2">
            {(stats.activeEmergencyList ?? []).map((emergency: any) => (
              <div key={emergency.id} className="rounded-xl border border-red-100 bg-red-50/60 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">{emergency.memberName}</p>
                    <p className="text-xs font-bold text-foreground">{emergency.category ?? 'Emergency Care'}</p>
                  </div>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">{emergency.status}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Triggered {new Date(emergency.createdAt).toLocaleString()}</p>
              </div>
            ))}

            {!(stats.activeEmergencyList ?? []).length && (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-center text-[11px] text-muted-foreground">
                No active emergencies right now.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-surface p-3 shadow-xs">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Bookings</p>
            <h2 className="text-sm font-bold text-foreground">Live queue</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/portal/admin/bookings')}>
            View all
          </Button>
        </div>

        <div className="mb-3 flex flex-wrap gap-1 border-b border-border pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-1.5 text-[11px] font-semibold rounded-t-md transition-colors',
                activeTab === tab.id ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable
          columns={[
            {
              key: 'categoryLabel',
              header: 'Booking',
              render: (row: any) => (
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{row.categoryLabel ?? row.category}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize', statusBadge[row.status ?? 'pending'])}>{row.status?.replace(/_/g, ' ')}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] capitalize', priorityBadge[row.priority ?? 'standard'])}>{row.priority ?? 'standard'}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{row.patientName} ({row.familyName})</p>
                </div>
              ),
            },
            { key: 'providerName', header: 'Provider', render: (row: any) => <span className="text-xs font-medium">{row.providerName ?? 'Unassigned Provider'}</span> },
            { key: 'employeeName', header: 'Assigned Staff', render: (row: any) => <span className="text-xs text-muted-foreground">{row.employeeName ?? '—'}</span> },
            { key: 'scheduledAt', header: 'Schedule', render: (row: any) => <span className="text-[11px] text-muted-foreground">{new Date(row.scheduledAt).toLocaleString()}</span> },
            { key: 'estimatedCost', header: 'Cost', render: (row: any) => <span className="text-xs font-bold">{row.currency ?? '₹'}{row.estimatedCost ?? 0}</span> },
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
          data={recentRequests}
          isLoading={requestsLoading}
          rowKey={(row: any) => row.id}
        />
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-background p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Booking</p>
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

export default AdminDashboard;