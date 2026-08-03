import { useMemo, useState } from 'react';
import { icons, type IconName } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table';
import { useAdminCategoriesQuery, useToggleCategoryMutation, useCreateCategoryMutation } from '@/hooks/use-portal-queries';

export const ServiceCategoriesPage = () => {
  const { data: categories = [], isLoading, refetch } = useAdminCategoriesQuery();
  const toggleMutation = useToggleCategoryMutation();
  const createMutation = useCreateCategoryMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Stethoscope');

  const pageSize = 8;

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;

    return categories.filter((cat: any) =>
      [cat.name, cat.id, cat.description, cat.icon].some((value) =>
        String(value ?? '').toLowerCase().includes(term)
      )
    );
  }, [categories, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedCategories = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, safePage]);

  const handleToggle = async (id: string) => {
    await toggleMutation.mutateAsync(id);
    refetch();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await createMutation.mutateAsync({
      name: newCatName,
      description: newCatDesc,
      icon: newCatIcon,
      color: '#3B82F6',
    });
    setShowCreateModal(false);
    setNewCatName('');
    setNewCatDesc('');
    refetch();
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <icons.Tags className="h-4 w-4" /> Platform Taxonomy
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-foreground">Service Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage platform care categories, enable/disable offerings, and add new services.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search categories"
                className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-64"
              />
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="font-bold shadow-md text-sm"
            >
              <icons.Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={[
            {
              key: 'name',
              header: 'Category',
              render: (row: any) => {
                const Icon = icons[row.icon as IconName] ?? icons.Stethoscope;
                return (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {row.id}</p>
                    </div>
                  </div>
                );
              },
            },
            {
              key: 'description',
              header: 'Description',
              render: (row: any) => <span className="text-sm text-muted-foreground">{row.description || '—'}</span>,
            },
            {
              key: 'providerCount',
              header: 'Providers',
              render: (row: any) => <span className="text-sm font-semibold text-foreground">{row.providerCount ?? 0}</span>,
            },
            {
              key: 'requestCount',
              header: 'Requests',
              render: (row: any) => <span className="text-sm font-semibold text-foreground">{row.requestCount ?? 0}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (row: any) => (
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-bold',
                    row.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                  )}
                >
                  {row.enabled ? 'Active' : 'Disabled'}
                </span>
              ),
            },
            {
              key: 'actions',
              header: 'Action',
              className: 'text-right',
              render: (row: any) => (
                <Button variant="outline" size="sm" onClick={() => handleToggle(row.id)}>
                  {row.enabled ? 'Disable' : 'Enable'}
                </Button>
              ),
            },
          ]}
          data={pagedCategories}
          isLoading={isLoading}
          page={safePage}
          pageSize={pageSize}
          total={filteredCategories.length}
          totalPages={totalPages}
          onPageChange={(next) => setPage(next)}
          rowKey={(row: any) => row.id}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form onSubmit={handleCreate} className="rounded-2xl bg-background border border-border p-6 shadow-2xl max-w-md w-full mx-4 space-y-4">
            <h3 className="font-bold text-lg text-foreground">Create Service Category</h3>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Category Name</label>
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Elderly Companion"
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Description</label>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief category description..."
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Icon Name (Lucide)</label>
              <select
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {['Stethoscope', 'Building2', 'Users', 'HeartPulse', 'Pill', 'FlaskConical', 'Ambulance', 'Car', 'Zap', 'Activity', 'Home', 'Wrench'].map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-primary text-white" disabled={createMutation.isPending}>
                Create Category
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServiceCategoriesPage;
