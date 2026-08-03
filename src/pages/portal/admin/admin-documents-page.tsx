import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminDocumentsQuery, useVerifyDocumentMutation } from '@/hooks/use-portal-queries';
import { useAdminStore } from '@/store/admin.store';

export const AdminDocumentsPage = () => {
  const { documentFilters, setDocumentFilters } = useAdminStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: documents = [], isLoading, refetch } = useAdminDocumentsQuery({
    search: documentFilters.search,
    type: typeFilter,
  });

  const verifyMutation = useVerifyDocumentMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentFilters({ search, type: typeFilter });
  };

  const handleVerify = async (id: string) => {
    await verifyMutation.mutateAsync(id);
    refetch();
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          <icons.FileText className="h-4 w-4" /> Platform Compliance
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-foreground">Document Management Repository</h1>
        <p className="text-sm text-muted-foreground mt-1">{documents.length} compliance documents, licenses, & government IDs indexed</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents by title, filename, or owner..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button type="submit" size="sm" className="bg-primary text-white">Search</Button>
        </form>
        <div className="flex flex-wrap gap-1.5">
          {['all', 'license', 'gst', 'registration', 'insurance', 'certificate'].map((t) => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setDocumentFilters({ type: t, search }); }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-colors',
                typeFilter === t ? 'bg-primary text-white border-primary' : 'bg-surface text-muted-foreground border-border hover:border-primary'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc: any) => (
            <div key={doc.id} className="rounded-2xl border border-border/60 bg-surface p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 shrink-0">
                      <icons.FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm line-clamp-1">{doc.title}</h3>
                      <p className="text-2xs text-muted-foreground capitalize">{doc.type}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'text-2xs px-2 py-0.5 rounded-full font-bold capitalize shrink-0',
                    doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                    doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {doc.status}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-2.5 rounded-lg border border-border/40 mt-2">
                  <p className="truncate"><span className="font-medium text-foreground">File:</span> {doc.fileName}</p>
                  <p><span className="font-medium text-foreground">Owner:</span> {doc.ownerName} ({doc.ownerType})</p>
                  <p><span className="font-medium text-foreground">Uploaded:</span> {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <Button variant="ghost" size="sm" className="text-xs text-primary">
                  <icons.Download className="h-3.5 w-3.5 mr-1" /> View / Download
                </Button>

                {doc.status === 'pending' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-8" onClick={() => handleVerify(doc.id)}>
                    Verify
                  </Button>
                )}
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <icons.FileText className="h-10 w-10 mb-3 opacity-40" />
              <p className="font-medium">No documents found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDocumentsPage;
