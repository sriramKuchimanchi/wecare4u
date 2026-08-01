import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  useProviderRequestDetailQuery,
  useProviderEmployeesQuery,
  useUpdateRequestStatusMutation,
  useAssignEmployeeMutation,
} from '@/hooks/use-portal-queries';
import { careProviderPortalService } from '@/services/care-provider-portal.service';
import { cn } from '@/lib/utils';
import type { CareRequestStatus } from '@/types';

export const CareRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newNote, setNewNote] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState('');

  const requestId = id ?? 'req_101';
  const { data: req, isLoading, refetch } = useProviderRequestDetailQuery(requestId);
  const { data: employees = [] } = useProviderEmployeesQuery();

  const updateStatusMutation = useUpdateRequestStatusMutation();
  const assignMutation = useAssignEmployeeMutation();

  if (isLoading || !req) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleStatusChange = async (nextStatus: CareRequestStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: req.id, status: nextStatus });
      toast({
        title: 'Status Updated',
        description: `Request status changed to ${nextStatus.replace(/_/g, ' ')}. Timeline & family notified.`,
      });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmpId) return;
    try {
      await assignMutation.mutateAsync({ requestId: req.id, employeeId: selectedEmpId });
      toast({ title: 'Employee Assigned', description: 'Staff member assigned successfully.' });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to assign staff.', variant: 'destructive' });
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await careProviderPortalService.addInternalNote(req.id, newNote.trim());
      toast({ title: 'Note Added', description: 'Internal note saved.' });
      setNewNote('');
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to add note.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/portal/care-provider/requests')}>
            <icons.ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Request #{req.id}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {req.categoryLabel || req.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Submitted by {req.familyName || 'Family'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleStatusChange('on_the_way')}>
            <icons.Navigation className="mr-1.5 h-3.5 w-3.5" /> Mark On The Way
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleStatusChange('in_progress')}>
            <icons.Play className="mr-1.5 h-3.5 w-3.5" /> Start Service
          </Button>
          <Button size="sm" onClick={() => handleStatusChange('completed')}>
            <icons.CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Mark Completed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient & Medical Notes Card */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.User className="h-5 w-5 text-primary" /> Patient & Medical Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="rounded-xl bg-muted/40 p-4 border">
                <span className="text-2xs font-semibold text-muted-foreground uppercase">Patient Name</span>
                <p className="text-base font-bold text-foreground mt-0.5">{req.patientName || 'Madhav Rao'}</p>
                <p className="text-xs text-muted-foreground mt-1">Family: {req.familyName || 'Rao Family'}</p>
              </div>

              <div className="rounded-xl bg-muted/40 p-4 border">
                <span className="text-2xs font-semibold text-muted-foreground uppercase">Service Category</span>
                <p className="text-base font-bold text-foreground mt-0.5">{req.categoryLabel || req.category}</p>
                <p className="text-xs text-muted-foreground mt-1">Duration: {req.estimatedDuration || '45 mins'}</p>
              </div>
            </div>

            {/* Medical Notes */}
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <icons.AlertTriangle className="h-4 w-4" /> Medical Notes & Instructions
              </span>
              <p className="text-xs text-amber-900 leading-relaxed">
                {req.medicalNotes || 'Patient requires blood pressure check & diabetes log review before session.'}
              </p>
            </div>
          </div>

          {/* Address & Contact Card */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.MapPin className="h-5 w-5 text-primary" /> Location & Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-2xs font-semibold text-muted-foreground uppercase">Visit Address</span>
                <p className="text-sm font-semibold text-foreground">
                  {req.address?.line1 || 'Marina Heights, Apt 1203'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {req.address?.city || 'Dubai'}, {req.address?.country || 'UAE'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-2xs font-semibold text-muted-foreground uppercase">Primary Contact</span>
                <p className="text-sm font-semibold text-foreground">+971 50 123 4567</p>
                <p className="text-xs text-muted-foreground">Aaradhya Rao (Daughter)</p>
              </div>
            </div>
          </div>

          {/* Timeline & Status History */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.History className="h-5 w-5 text-primary" /> Status History & Live Timeline
            </h2>

            <div className="relative pl-6 border-l-2 border-primary/20 space-y-6 pt-2">
              {req.timeline?.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-surface" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                    <span className="text-2xs text-muted-foreground">
                      {new Date(step.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  {step.description && <p className="text-xs text-muted-foreground mt-1">{step.description}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.MessageSquare className="h-5 w-5 text-primary" /> Internal Provider Notes
            </h2>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {req.internalNotes && req.internalNotes.length > 0 ? (
                req.internalNotes.map((note, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 p-3 text-xs text-foreground border">
                    {note}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No internal notes added yet.</p>
              )}
            </div>

            <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Add internal note for staff..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" size="sm" className="shrink-0">
                Add Note
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar Column (1 col): Staff Assignment & Status Transition */}
        <div className="space-y-6">
          {/* Assigned Staff Card */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.UserCheck className="h-5 w-5 text-primary" /> Assigned Care Staff
            </h2>

            {req.employeeName ? (
              <div className="rounded-xl bg-primary/5 p-4 border border-primary/20 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                    {req.employeeName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{req.employeeName}</h3>
                    <p className="text-xs text-muted-foreground">{req.employeeRole || 'Care Staff'}</p>
                  </div>
                </div>
                <div className="border-t pt-2 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Phone Contact:</span>
                  <span className="font-semibold text-foreground">{req.employeePhone || '+971 50 555 1212'}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20 text-center">
                <p className="text-xs font-bold text-amber-700">No Employee Assigned Yet</p>
                <p className="text-2xs text-amber-600 mt-0.5">Assign a staff member below to start visit</p>
              </div>
            )}

            {/* Change Staff Form */}
            <div className="space-y-2 pt-2 border-t">
              <label className="text-xs font-semibold text-foreground block">Assign / Reassign Staff</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
              <Button size="sm" className="w-full" onClick={handleAssignEmployee} disabled={!selectedEmpId}>
                Assign Employee
              </Button>
            </div>
          </div>

          {/* Manual Status Selector */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.Settings className="h-5 w-5 text-primary" /> Update Request Status
            </h2>

            <div className="space-y-2">
              {(
                [
                  'pending',
                  'accepted',
                  'employee_assigned',
                  'on_the_way',
                  'arrived',
                  'in_progress',
                  'completed',
                  'awaiting_review',
                  'cancelled',
                ] as CareRequestStatus[]
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={cn(
                    'w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all text-left',
                    req.status === st
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-background hover:bg-muted text-foreground'
                  )}
                >
                  <span className="capitalize">{st.replace(/_/g, ' ')}</span>
                  {req.status === st && <icons.Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
