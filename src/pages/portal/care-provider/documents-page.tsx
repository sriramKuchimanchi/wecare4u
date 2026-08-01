import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProviderDocumentsQuery, useUploadDocumentMutation } from '@/hooks/use-portal-queries';
import { cn } from '@/lib/utils';
import type { ProviderDocument } from '@/types';

export const DocumentsPage = () => {
  const { toast } = useToast();
  const { data: documents = [], isLoading, refetch } = useProviderDocumentsQuery();
  const uploadMutation = useUploadDocumentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<ProviderDocument['type']>('license');
  const [fileName, setFileName] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !fileName) {
      toast({ title: 'Validation Error', description: 'Please provide document title and file name.', variant: 'destructive' });
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        title: docTitle,
        type: docType,
        fileName: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
        fileUrl: '#',
      });
      toast({ title: 'Document Uploaded', description: 'Document uploaded for verification.' });
      setIsModalOpen(false);
      setDocTitle('');
      setFileName('');
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to upload document.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Documents & Licenses</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage health licenses, commercial registration, tax IDs, and insurance policies</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-sm">
          <icons.Upload className="h-4 w-4" /> Upload New Document
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl bg-surface p-5 border border-border/60 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <icons.FileText className="h-5 w-5" />
                  </div>

                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-2xs font-bold capitalize border',
                      doc.verificationStatus === 'verified'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                    )}
                  >
                    {doc.verificationStatus}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground">{doc.title}</h3>
                  <span className="text-2xs font-semibold text-muted-foreground uppercase">{doc.type} Document</span>
                </div>

                <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1 border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>File:</span>
                    <span className="font-semibold text-foreground truncate max-w-[150px]">{doc.fileName}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Uploaded:</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  {doc.notes && <p className="text-2xs text-emerald-700 font-medium pt-1 border-t">{doc.notes}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast({ title: 'Download Mock', description: `Downloading ${doc.fileName}` })}>
                  <icons.Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <form onSubmit={handleUpload} className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-foreground">Upload Compliance Document</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <icons.X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground mb-1 block">Document Title *</label>
                <Input
                  placeholder="e.g. DHA Facility License 2026"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-foreground mb-1 block">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as ProviderDocument['type'])}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="license">Health Facility License</option>
                  <option value="registration">Commercial Registration</option>
                  <option value="gst">VAT / Tax Certificate</option>
                  <option value="insurance">Medical Liability Insurance</option>
                  <option value="employee">Employee Certificate Bundle</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground mb-1 block">File Name *</label>
                <Input
                  placeholder="e.g. License_Sunrise_2026.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit for Verification</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
