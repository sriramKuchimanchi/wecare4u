import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { ServiceNote } from '@/types';

type ServiceNotesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noteData: Omit<ServiceNote, 'id' | 'createdAt'>) => Promise<void>;
  requestId: string;
  employeeId?: string;
  isLoading?: boolean;
};

export const ServiceNotesModal = ({
  isOpen,
  onClose,
  onSubmit,
  requestId,
  employeeId = 'emp_1',
  isLoading = false,
}: ServiceNotesModalProps) => {
  const { toast } = useToast();

  const [visitNotes, setVisitNotes] = useState('');
  const [observations, setObservations] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [followUpNeeded, setFollowUpNeeded] = useState(false);
  const [followUpDetails, setFollowUpDetails] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);

  if (!isOpen) return null;

  const handleAddAttachment = () => {
    if (!attachmentName.trim()) return;
    setAttachments((prev) => [...prev, { name: attachmentName.trim(), url: '#' }]);
    setAttachmentName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitNotes.trim()) {
      toast({ title: 'Validation Error', description: 'Please enter visit notes before submitting completion.', variant: 'destructive' });
      return;
    }

    try {
      await onSubmit({
        requestId,
        employeeId,
        visitNotes,
        observations,
        recommendations,
        followUpNeeded,
        followUpDetails: followUpNeeded ? followUpDetails : undefined,
        attachments,
      });
      toast({
        title: 'Visit Completed & Notes Saved',
        description: 'Service completion submitted to provider and logged to family timeline.',
      });
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to submit service notes.', variant: 'destructive' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <icons.ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Service Visit Notes & Completion</h2>
              <p className="text-xs text-muted-foreground">Document clinical observations, vitals & recommendations</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <icons.X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-foreground mb-1 block">Visit & Care Notes *</label>
            <textarea
              rows={3}
              placeholder="Detail procedures performed, vitals recorded, medicine administered..."
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="font-bold text-foreground mb-1 block">Patient Observations</label>
            <Input
              placeholder="e.g. Patient appeared alert, good mobility, normal appetite"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>

          <div>
            <label className="font-bold text-foreground mb-1 block">Recommendations for Family / Doctor</label>
            <Input
              placeholder="e.g. Ensure daily hydration, schedule follow up blood pressure check"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
            />
          </div>

          <div className="rounded-xl bg-muted/40 p-4 border space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="followupCheck"
                checked={followUpNeeded}
                onChange={(e) => setFollowUpNeeded(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="followupCheck" className="font-bold text-foreground cursor-pointer">
                Follow-up Visit or Action Needed
              </label>
            </div>

            {followUpNeeded && (
              <Input
                placeholder="Specify follow-up details & recommended date..."
                value={followUpDetails}
                onChange={(e) => setFollowUpDetails(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Attachments (Mock) */}
          <div className="space-y-2">
            <label className="font-bold text-foreground block">Attachments & Reports (Mock)</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="e.g. Vitals_Report.pdf"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={handleAddAttachment} className="shrink-0">
                Attach
              </Button>
            </div>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {attachments.map((att, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-2xs font-semibold text-primary">
                    <icons.FileText className="h-3 w-3" /> {att.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              {isLoading && <icons.Loader2 className="h-4 w-4 animate-spin" />}
              Submit Completion & Notes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
