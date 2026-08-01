import { useState } from 'react';
import { icons, type IconName } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminCategoriesQuery, useToggleCategoryMutation, useCreateCategoryMutation } from '@/hooks/use-portal-queries';

export const ServiceCategoriesPage = () => {
  const { data: categories = [], isLoading, refetch } = useAdminCategoriesQuery();
  const toggleMutation = useToggleCategoryMutation();
  const createMutation = useCreateCategoryMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Stethoscope');

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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 p-6 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
            <icons.Tags className="h-4 w-4" /> Platform Taxonomy
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">Service Categories</h1>
          <p className="text-sm text-white/80 mt-1">Manage platform care categories, enable/disable offerings, and add new services.</p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-white text-teal-900 hover:bg-teal-50 font-bold shadow-md text-sm"
        >
          <icons.Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Grid of Categories */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: any) => {
            const Icon = icons[cat.icon as IconName] ?? icons.Stethoscope;

            return (
              <div
                key={cat.id}
                className={cn(
                  'rounded-2xl border p-5 bg-surface shadow-xs transition-all flex flex-col justify-between space-y-4',
                  !cat.enabled && 'opacity-60 bg-muted/30 border-dashed'
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-base">{cat.name}</h3>
                        <p className="text-2xs text-muted-foreground">ID: {cat.id}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(cat.id)}
                      className={cn(
                        'text-xs font-bold px-3 py-1 rounded-full transition-colors',
                        cat.enabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      )}
                    >
                      {cat.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Providers: <strong className="text-foreground">{cat.providerCount ?? 0}</strong></span>
                  <span>Total Requests: <strong className="text-foreground">{cat.requestCount ?? 0}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
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
