import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProviderRequestDetailQuery, useUpdateRequestStatusMutation } from '@/hooks/use-portal-queries';
import { careProviderPortalService } from '@/services/care-provider-portal.service';
import { CareRequestStatusStepper, statusSteps } from '@/components/care-coordination/CareRequestStatusStepper';

export const CareRequestDetailPage = () => {
  const { id: paramId } = useParams<{ id?: string }>();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const requestId = paramId || segments[segments.length - 1] || 'req_101';

  const navigate = useNavigate();
  const { toast } = useToast();

  const [newNote, setNewNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: req, isLoading, refetch } = useProviderRequestDetailQuery(requestId);
  const updateStatusMutation = useUpdateRequestStatusMutation();

  if (isLoading || !req) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === req.status);
  const nextStep = req.status === 'completed' || req.status === 'cancelled' ? null : statusSteps[currentStepIndex + 1];

  const handleAdvance = async () => {
    if (!nextStep) return;
    try {
      await updateStatusMutation.mutateAsync({ id: req.id, status: nextStep.key });
      toast({ title: 'Status Updated', description: `Booking marked as "${nextStep.label}". Family notified.` });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  };

  const handleCancel = async () => {
    try {
      await updateStatusMutation.mutateAsync({ id: req.id, status: 'cancelled', note: 'Provider was unable to fulfill request.' });
      toast({ title: 'Booking Cancelled', description: 'Family has been notified.' });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to cancel request.', variant: 'destructive' });
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await careProviderPortalService.addInternalNote(req.id, newNote.trim());
      toast({ title: 'Note Added', description: 'Visit note saved.' });
      setNewNote('');
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to add note.', variant: 'destructive' });
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      const kind = file.type.startsWith('image/') ? 'image' : 'document';
      await careProviderPortalService.addAttachment(req.id, { name: file.name, url, kind });
      toast({ title: 'File Uploaded', description: `${file.name} attached to this visit.` });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to upload file.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/portal/care-provider/bookings')}>
            <icons.ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Booking #{req.id}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {req.categoryLabel || req.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Submitted by {req.familyName || 'Family'}</p>
          </div>
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

          {/* Visit Notes & Attachments */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.FileText className="h-5 w-5 text-primary" /> Visit Notes & Attachments
            </h2>
            <p className="text-xs text-muted-foreground -mt-2">
              Notes and files added here become visible to the family under this request once the visit is completed.
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {req.internalNotes && req.internalNotes.length > 0 ? (
                req.internalNotes.map((note, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 p-3 text-xs text-foreground border">
                    {note}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No visit notes added yet.</p>
              )}
            </div>

            {req.attachments && req.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {req.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 text-2xs font-semibold text-foreground hover:border-primary/40"
                  >
                    {att.kind === 'image' ? <icons.Image className="h-3.5 w-3.5 text-primary" /> : <icons.FileText className="h-3.5 w-3.5 text-primary" />}
                    <span className="max-w-[140px] truncate">{att.name}</span>
                  </a>
                ))}
              </div>
            )}

            <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Add a visit note for this family..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" size="sm" className="shrink-0">
                Add Note
              </Button>
            </form>

            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              {isUploading ? <icons.Loader2 className="h-3.5 w-3.5 animate-spin" /> : <icons.Upload className="h-3.5 w-3.5" />}
              Upload photo or document
              <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleUploadFile} disabled={isUploading} />
            </label>
          </div>
        </div>

        {/* Sidebar Column (1 col): Progress Tracker */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.Activity className="h-5 w-5 text-primary" /> Booking Progress
            </h2>

            {req.status === 'cancelled' ? (
              <CareRequestStatusStepper currentStatus={req.status} timeline={req.timeline} />
            ) : (
              <>
                <CareRequestStatusStepper currentStatus={req.status} timeline={req.timeline} />
                {nextStep && (
                  <Button onClick={handleAdvance} disabled={updateStatusMutation.isPending} className="w-full font-bold">
                    {updateStatusMutation.isPending ? <icons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <icons.ArrowRight className="mr-2 h-4 w-4" />}
                    Mark as {nextStep.label}
                  </Button>
                )}
                {req.status !== 'completed' && (
                  <Button variant="ghost" onClick={handleCancel} disabled={updateStatusMutation.isPending} className="w-full text-destructive hover:text-destructive">
                    Cancel Booking
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareRequestDetailPage;
