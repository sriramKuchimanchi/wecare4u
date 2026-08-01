import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  useProviderRequestsQuery,
  useProviderEmployeesQuery,
  useAcceptRequestMutation,
  useRejectRequestMutation,
  useAssignEmployeeMutation,
} from '@/hooks/use-portal-queries';
import { cn } from '@/lib/utils';
import type { CareRequestStatus } from '@/types';

export const CareRequestsListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignModalReqId, setAssignModalReqId] = useState<string | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState('');

  const { data: requests = [], isLoading } = useProviderRequestsQuery({
    search,
    status: statusFilter,
    priority: priorityFilter,
  });
  const { data: employees = [] } = useProviderEmployeesQuery();

  const acceptMutation = useAcceptRequestMutation();
  const rejectMutation = useRejectRequestMutation();
  const assignMutation = useAssignEmployeeMutation();

  const handleAccept = async (id: string) => {
    try {
      await acceptMutation.mutateAsync(id);
      toast({ title: 'Request Accepted', description: 'Care request accepted. You can now assign staff.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to accept request.', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync({ id, reason: 'Staff unavailable' });
      toast({ title: 'Request Declined', description: 'Care request declined.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to decline request.', variant: 'destructive' });
    }
  };

  const handleConfirmAssign = async () => {
    if (!assignModalReqId || !selectedEmpId) return;
    try {
      await assignMutation.mutateAsync({ requestId: assignModalReqId, employeeId: selectedEmpId });
      toast({ title: 'Employee Assigned', description: 'Staff member assigned successfully.' });
      setAssignModalReqId(null);
      setSelectedEmpId('');
    } catch {
      toast({ title: 'Error', description: 'Failed to assign employee.', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: CareRequestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'accepted':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'employee_assigned':
      case 'professional_assigned':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30';
      case 'on_the_way':
        return 'bg-sky-500/10 text-sky-600 border-sky-500/30';
      case 'arrived':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'in_progress':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'completed':
      case 'awaiting_review':
        return 'bg-gray-500/10 text-gray-700 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Care Requests</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage incoming family requests and assign staff</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 rounded-2xl bg-surface p-4 border border-border/60 shadow-xs">
        <div className="relative flex-1">
          <icons.Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient, family or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="employee_assigned">Employee Assigned</option>
          <option value="on_the_way">On The Way</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Priorities</option>
          <option value="emergency">Emergency</option>
          <option value="urgent">Urgent</option>
          <option value="standard">Standard</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Request Cards / Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl bg-surface p-12 text-center border border-border/60">
          <icons.ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-base font-bold text-foreground mt-3">No Care Requests Found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try resetting your search or status filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl bg-surface p-5 border border-border/60 shadow-xs hover:border-primary/40 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {req.patientName ? req.patientName.charAt(0) : 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">
                        {req.patientName || 'Madhav Rao'}
                      </h3>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {req.familyName || 'Family Request'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Service: <span className="font-semibold text-foreground">{req.categoryLabel || req.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.priority === 'emergency' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-2xs font-black uppercase text-red-600 border border-red-500/30 animate-pulse">
                      <icons.AlertCircle className="h-3 w-3" /> Emergency
                    </span>
                  )}
                  {req.priority === 'urgent' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-2xs font-black uppercase text-amber-600 border border-amber-500/30">
                      <icons.Clock className="h-3 w-3" /> Urgent
                    </span>
                  )}

                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize border',
                      getStatusBadge(req.status)
                    )}
                  >
                    {req.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Request Metadata Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-2xs font-medium">Location</span>
                  <div className="flex items-center gap-1 font-medium text-foreground mt-0.5 truncate">
                    <icons.MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{req.address?.line1 || 'Marina Heights, Dubai'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-2xs font-medium">Requested Time</span>
                  <div className="flex items-center gap-1 font-medium text-foreground mt-0.5">
                    <icons.CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{new Date(req.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-2xs font-medium">Assigned Employee</span>
                  <div className="flex items-center gap-1 font-medium text-foreground mt-0.5">
                    <icons.UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{req.employeeName || 'Unassigned'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-2xs font-medium">Estimated Cost</span>
                  <div className="flex items-center gap-1 font-bold text-foreground mt-0.5">
                    <span>₹{req.estimatedCost || 1500}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/portal/care-provider/requests/${req.id}`)}
                >
                  <icons.Eye className="mr-1.5 h-3.5 w-3.5" /> View Details
                </Button>

                <div className="flex flex-wrap items-center gap-2">
                  {req.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(req.id)}
                      >
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleAccept(req.id)}>
                        <icons.Check className="mr-1.5 h-3.5 w-3.5" /> Accept Request
                      </Button>
                    </>
                  )}

                  {req.status !== 'pending' && req.status !== 'cancelled' && req.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setAssignModalReqId(req.id);
                        setSelectedEmpId(req.employeeId || '');
                      }}
                    >
                      <icons.UserPlus className="mr-1.5 h-3.5 w-3.5" /> Assign / Change Employee
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Employee Modal */}
      {assignModalReqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-foreground">Assign Employee to Request</h3>
              <Button variant="ghost" size="icon" onClick={() => setAssignModalReqId(null)}>
                <icons.X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">Select an available staff member to dispatch for this visit:</p>

            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role}) - {emp.availability.toUpperCase()}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 border-t pt-3">
              <Button variant="outline" onClick={() => setAssignModalReqId(null)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmAssign} disabled={!selectedEmpId}>
                Confirm Assignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
