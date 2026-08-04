import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  useEmployeeRequestDetailQuery,
  useEmployeeWorkflowMutation,
  useSubmitServiceNotesMutation,
} from '@/hooks/use-portal-queries';
import { ServiceNotesModal } from './service-notes-modal';
import { cn } from '@/lib/utils';
import type { CareRequestStatus, ServiceNote } from '@/types';

export const EmployeeRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const requestId = id ?? 'req_101';
  const { data, isLoading, refetch } = useEmployeeRequestDetailQuery(requestId);

  const workflowMutation = useEmployeeWorkflowMutation();
  const submitNotesMutation = useSubmitServiceNotesMutation();

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  if (isLoading || !data?.request) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { request: req, notes } = data;

  const handleStepAdvance = async (nextStatus: CareRequestStatus, note?: string) => {
    try {
      await workflowMutation.mutateAsync({ requestId: req.id, nextStatus, note });
      toast({
        title: 'Status Updated',
        description: `Workflow updated to ${nextStatus.replace(/_/g, ' ')}.`,
      });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to update workflow status.', variant: 'destructive' });
    }
  };

  const handleSubmitServiceNotes = async (noteInput: Omit<ServiceNote, 'id' | 'createdAt'>) => {
    await submitNotesMutation.mutateAsync(noteInput);
    refetch();
  };

  return (
    <div className="space-y-6 pb-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/portal/employee/requests')}>
            <icons.ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Visit Console #{req.id}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                {req.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Assigned to field staff</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-emerald-500/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 gap-1.5"
          onClick={() => setCallModalOpen(true)}
        >
          <icons.Phone className="h-3.5 w-3.5" /> Call Family (Mock)
        </Button>
      </div>

      {/* Sequential Workflow Execution Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-hover p-6 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary-foreground/90">
            Field Workflow Progress
          </h2>
          <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white capitalize">
            Current: {req.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Workflow Action Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <Button
            size="sm"
            variant={req.status === 'accepted' ? 'secondary' : 'outline'}
            className={cn('text-xs font-bold', req.status === 'on_the_way' ? 'bg-white text-primary' : 'text-white border-white/30')}
            onClick={() => handleStepAdvance('on_the_way')}
          >
            <icons.Navigation className="mr-1 h-3.5 w-3.5" /> 1. Start Navigation
          </Button>

          <Button
            size="sm"
            variant={req.status === 'on_the_way' ? 'secondary' : 'outline'}
            className={cn('text-xs font-bold', req.status === 'arrived' ? 'bg-white text-primary' : 'text-white border-white/30')}
            onClick={() => handleStepAdvance('arrived')}
          >
            <icons.MapPin className="mr-1 h-3.5 w-3.5" /> 2. Mark Arrived
          </Button>

          <Button
            size="sm"
            variant={req.status === 'arrived' ? 'secondary' : 'outline'}
            className={cn('text-xs font-bold', req.status === 'in_progress' ? 'bg-white text-primary' : 'text-white border-white/30')}
            onClick={() => handleStepAdvance('in_progress')}
          >
            <icons.Play className="mr-1 h-3.5 w-3.5" /> 3. Service Started
          </Button>

          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
            onClick={() => setIsNotesModalOpen(true)}
          >
            <icons.CheckCircle2 className="mr-1 h-3.5 w-3.5" /> 4. Complete Visit
          </Button>
        </div>
      </div>

      {/* Patient & Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Details */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.User className="h-5 w-5 text-primary" /> Patient Details
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Patient Name:</span>
              <span className="font-bold text-foreground text-sm">{req.patientName || 'Madhav Rao'}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Family Name:</span>
              <span className="font-semibold text-foreground">{req.familyName || 'Rahman Family'}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Service Required:</span>
              <span className="font-bold text-primary">{req.categoryLabel || req.category}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Scheduled Time:</span>
              <span className="font-semibold text-foreground">
                {new Date(req.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
          </div>
        </div>

        {/* Address & GPS Navigation Placeholder */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.MapPin className="h-5 w-5 text-primary" /> Destination & Live GPS (Mock)
          </h2>

          <div className="rounded-xl bg-muted/50 p-3 border text-xs space-y-1">
            <p className="font-bold text-foreground">{req.address?.line1 || 'Marina Heights, Apt 1203'}</p>
            <p className="text-muted-foreground">{req.address?.city || 'Dubai'}, UAE</p>
          </div>

          {/* Navigation Placeholder Box */}
          <div className="rounded-xl bg-slate-900 p-4 text-white space-y-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <icons.Navigation className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold">GPS Route Calculated</p>
                <p className="text-2xs text-slate-300">ETA: {req.estimatedArrivalMinutes || 12} mins (3.4 km)</p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 border border-white/40 text-xs font-semibold backdrop-blur-xs"
              onClick={() => toast({ title: 'Navigation Started', description: 'Simulating GPS directions to patient location.' })}
            >
              Open Maps
            </Button>
          </div>
        </div>
      </div>

      {/* Medical Notes & Instructions */}
      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <icons.Stethoscope className="h-5 w-5 text-primary" /> Medical Notes & Care Instructions
        </h2>

        <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20 text-xs text-amber-900 leading-relaxed">
          {req.medicalNotes || 'Patient has diabetes & hypertension. Check vitals and review morning insulin log.'}
        </div>
      </div>

      {/* Submitted Visit Notes (if completed) */}
      {notes && (
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.ClipboardList className="h-5 w-5 text-emerald-600" /> Recorded Visit Notes
          </h2>

          <div className="space-y-3 text-xs bg-muted/40 p-4 rounded-xl border">
            <div>
              <span className="font-bold text-foreground block">Care Visit Notes:</span>
              <p className="text-muted-foreground mt-0.5">{notes.visitNotes}</p>
            </div>

            {notes.observations && (
              <div>
                <span className="font-bold text-foreground block">Observations:</span>
                <p className="text-muted-foreground mt-0.5">{notes.observations}</p>
              </div>
            )}

            {notes.recommendations && (
              <div>
                <span className="font-bold text-foreground block">Recommendations:</span>
                <p className="text-muted-foreground mt-0.5">{notes.recommendations}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Notes Modal */}
      <ServiceNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onSubmit={handleSubmitServiceNotes}
        requestId={req.id}
        isLoading={submitNotesMutation.isPending}
      />

      {/* Call Family Mock Popup */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <icons.PhoneCall className="h-7 w-7 animate-bounce" />
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground">Calling Family...</h3>
              <p className="text-xs font-semibold text-primary mt-1">Aaradhya Rao (+91 98200 12345)</p>
              <p className="text-2xs text-muted-foreground mt-1">Masked in-app call session active</p>
            </div>

            <Button variant="destructive" className="w-full" onClick={() => setCallModalOpen(false)}>
              End Call
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
