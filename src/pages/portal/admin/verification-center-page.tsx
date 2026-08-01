import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useVerificationQueueQuery, useApproveVerificationMutation, useRejectVerificationMutation } from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

export const VerificationCenterPage = () => {
  const { verificationFilters, setVerificationFilters } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: queue = [], isLoading, refetch } = useVerificationQueueQuery({
    status: activeTab,
    entityType: verificationFilters.entityType,
  });

  const approveMutation = useApproveVerificationMutation();
  const rejectMutation = useRejectVerificationMutation();

  const handleApprove = async (id: string) => {
    await approveMutation.mutateAsync(id);
    refetch();
  };

  const handleReject = async () => {
    if (!rejectId) return;
    await rejectMutation.mutateAsync({ id: rejectId, reason: rejectReason });
    setRejectId(null);
    setRejectReason('');
    refetch();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider">
          <icons.ShieldCheck className="h-4 w-4" /> Admin Operations
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mt-1">Verification Center</h1>
        <p className="text-sm text-white/90 mt-1">
          Review business credentials, licenses, GST registration, and employee certs before granting platform access.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap border-b border-border gap-1 pb-1">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => { setActiveTab(status); setVerificationFilters({ status }); }}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors capitalize',
              activeTab === status ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Queue List */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Details */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold shrink-0 text-lg">
                      {item.entityName?.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-lg">{item.entityName}</h3>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold capitalize">
                          {item.entityType}
                        </span>
                        <span className={cn(
                          'text-xs px-2.5 py-0.5 rounded-full font-bold capitalize',
                          item.status === 'approved' ? 'bg-green-100 text-green-700' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Submitted: {new Date(item.submittedAt).toLocaleDateString()} · Contact: {item.contactEmail} ({item.contactPhone})
                      </p>
                    </div>
                  </div>

                  {/* License info */}
                  <div className="flex flex-wrap gap-4 text-xs bg-muted/30 p-3 rounded-xl border border-border/40">
                    {item.registrationNumber && <span><span className="font-semibold text-foreground">Reg #:</span> {item.registrationNumber}</span>}
                    {item.gstNumber && <span><span className="font-semibold text-foreground">GST #:</span> {item.gstNumber}</span>}
                    {item.licenseNumber && <span><span className="font-semibold text-foreground">License #:</span> {item.licenseNumber}</span>}
                  </div>

                  {/* Document Attachments */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-foreground">Uploaded Verification Documents ({item.documents?.length ?? 0}):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.documents?.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-background text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <icons.FileText className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate font-medium text-foreground">{doc.title}</span>
                          </div>
                          <span className={cn(
                            'text-2xs px-2 py-0.5 rounded font-semibold capitalize shrink-0 ml-2',
                            doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          )}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-row lg:flex-col justify-end gap-2 shrink-0">
                  {item.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleApprove(item.id)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
                      >
                        <icons.CheckCircle className="h-4 w-4 mr-1.5" /> Approve Registration
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setRejectId(item.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 font-semibold text-xs"
                      >
                        <icons.XCircle className="h-4 w-4 mr-1.5" /> Reject
                      </Button>

                      <Button variant="ghost" className="text-xs text-muted-foreground">
                        <icons.FileText className="h-4 w-4 mr-1.5" /> Request Docs
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {queue.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <icons.ShieldCheck className="h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">No verification items pending</p>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-background border border-border p-6 shadow-2xl max-w-md w-full mx-4">
            <h3 className="font-bold text-foreground mb-2">Reject Verification Request</h3>
            <p className="text-sm text-muted-foreground mb-4">Please specify missing documents or rejection reasons.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={3}
              placeholder="Enter reason..."
            />
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setRejectId(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={handleReject} disabled={!rejectReason.trim() || rejectMutation.isPending}>
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationCenterPage;
