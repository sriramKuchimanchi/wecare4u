import { useMemo, useState } from 'react';
import { icons, type IconName } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useAdminCategoriesQuery,
  useToggleCategoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/hooks/use-portal-queries';
import { useToast } from '@/hooks/use-toast';

export const ServiceCategoriesPage = () => {
  const { data: categories = [], isLoading, refetch } = useAdminCategoriesQuery();
  const toggleMutation = useToggleCategoryMutation();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const { toast } = useToast();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Category creation state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Building2');
  const [newCatItems, setNewCatItems] = useState('');

  // Inline service addition state per category: { [catId]: 'new service name' }
  const [addingServiceForCat, setAddingServiceForCat] = useState<Record<string, string>>({});

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;

    return categories.filter((cat: any) =>
      [cat.name, cat.id, cat.description, cat.icon].some((value) =>
        String(value ?? '').toLowerCase().includes(term)
      ) || (cat.items && cat.items.some((item: any) => item.name.toLowerCase().includes(term)))
    );
  }, [categories, searchTerm]);

  const handleToggle = async (id: string) => {
    await toggleMutation.mutateAsync(id);
    refetch();
    toast({ title: 'Status updated', description: 'Category status has been toggled.' });
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    await deleteMutation.mutateAsync(id);
    refetch();
    toast({ title: 'Category deleted', description: `"${name}" has been removed.` });
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const parsedItems = newCatItems
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, icon: 'CheckCircle2' }));

    await createMutation.mutateAsync({
      name: newCatName,
      description: newCatDesc,
      icon: newCatIcon,
      color: '#3B82F6',
      items: parsedItems,
    });

    setShowCreateModal(false);
    setNewCatName('');
    setNewCatDesc('');
    setNewCatItems('');
    refetch();
    toast({ title: 'Category created!', description: `"${newCatName}" is now active and live on the landing page.` });
  };

  const handleAddService = async (cat: any) => {
    const serviceName = (addingServiceForCat[cat.id] || '').trim();
    if (!serviceName) return;

    const existingItems = cat.items || [];
    const updatedItems = [...existingItems, { name: serviceName, icon: 'CheckCircle2' }];

    await updateMutation.mutateAsync({
      id: cat.id,
      patch: { items: updatedItems },
    });

    setAddingServiceForCat((prev) => ({ ...prev, [cat.id]: '' }));
    refetch();
    toast({ title: 'Service added', description: `Added "${serviceName}" to ${cat.name}. It will now show in the landing page dropdown.` });
  };

  const handleRemoveService = async (cat: any, serviceNameToRemove: string) => {
    const existingItems = cat.items || [];
    const updatedItems = existingItems.filter((item: any) => item.name !== serviceNameToRemove);

    await updateMutation.mutateAsync({
      id: cat.id,
      patch: { items: updatedItems },
    });

    refetch();
    toast({ title: 'Service removed', description: `Removed "${serviceNameToRemove}" from ${cat.name}.` });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <icons.Tags className="h-4 w-4" /> Platform Taxonomy
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-foreground">Service Categories & Services</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add and manage categories and sub-services. Active categories and their services automatically show up on the landing page dropdowns.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories or services..."
                className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-64"
              />
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="font-bold shadow-md text-sm bg-primary text-primary-foreground hover:bg-primary/90"
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
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <icons.Tags className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3 text-lg font-bold text-foreground">No Categories Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or add a new category.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCategories.map((cat: any) => {
            const Icon = icons[cat.icon as IconName] ?? icons.Stethoscope;
            const items: any[] = cat.items ?? [];

            return (
              <div
                key={cat.id || cat.name}
                className={cn(
                  'flex flex-col justify-between rounded-2xl border bg-surface p-5 shadow-xs transition-all hover:shadow-soft',
                  cat.enabled ? 'border-border' : 'border-border/40 opacity-70 bg-muted/20'
                )}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider',
                              cat.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                            )}
                          >
                            {cat.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant={cat.enabled ? 'outline' : 'default'}
                        size="xs"
                        onClick={() => handleToggle(cat.id)}
                        className="text-xs font-semibold"
                      >
                        {cat.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Delete category"
                      >
                        <icons.Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Sub-services / Offerings */}
                  <div className="mt-5 border-t border-border/50 pt-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <icons.ListTree className="h-3.5 w-3.5 text-primary" />
                        Services Offered ({items.length})
                      </span>
                      <span className="text-2xs text-muted-foreground">Appears in landing page dropdown</span>
                    </div>

                    {/* Service badges list */}
                    <div className="flex flex-wrap gap-2">
                      {items.map((item: any) => (
                        <span
                          key={item.name}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-foreground group"
                        >
                          <icons.CheckCircle2 className="h-3 w-3 text-secondary shrink-0" />
                          {item.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveService(cat, item.name)}
                            className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                            title="Remove service"
                          >
                            <icons.X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}

                      {items.length === 0 && (
                        <p className="text-xs italic text-muted-foreground">No services added under this category yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inline Add Service Form */}
                <div className="mt-5 border-t border-border/50 pt-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddService(cat);
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={addingServiceForCat[cat.id] || ''}
                      onChange={(e) =>
                        setAddingServiceForCat((prev) => ({ ...prev, [cat.id]: e.target.value }))
                      }
                      placeholder={`+ Add service under ${cat.name}...`}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <Button type="submit" size="sm" className="h-7 px-3 text-xs font-bold shrink-0">
                      Add Service
                    </Button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleCreateCategory}
            className="rounded-2xl bg-background border border-border p-6 shadow-2xl max-w-md w-full space-y-4 animate-fade-in-up"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <icons.Plus className="h-5 w-5 text-primary" /> Create Service Category
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <icons.X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Category Name</label>
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Mental Wellness & Therapy"
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Description</label>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief summary of services offered..."
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Initial Sub-Services (comma-separated)</label>
              <input
                value={newCatItems}
                onChange={(e) => setNewCatItems(e.target.value)}
                placeholder="e.g. Counseling, Psychiatry, Stress Relief"
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-2xs text-muted-foreground mt-1">You can also add or remove services anytime directly from the category cards.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Category Icon</label>
              <select
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                className="w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {['Building2', 'FlaskConical', 'Pill', 'Activity', 'Wrench', 'Car', 'Siren', 'Stethoscope', 'Users', 'HeartPulse', 'Home', 'Zap', 'Brain', 'Smile', 'Heart'].map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-3 border-t border-border">
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
