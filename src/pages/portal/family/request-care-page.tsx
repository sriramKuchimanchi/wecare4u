import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Building2, HeartPulse, Users, Pill, FlaskConical, Ambulance, Car,
  Zap, Wrench, Home, Activity, ArrowRight, Loader2,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState, SearchBar } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/skeleton';
import { useCareCategories, useCareProviders } from '@/hooks/use-family-portal';
import { cn } from '@/lib/utils';
import type { LucideIcon } from '@/config/icons';

const iconMap: Record<string, LucideIcon> = {
  Stethoscope, Building2, HeartPulse, Users, Pill, FlaskConical, Ambulance, Car,
  Zap, Wrench, Home, Activity,
};

export const RequestCarePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { data: categories = [], isLoading: catLoading } = useCareCategories();
  const providersQuery = useCareProviders({ category: selectedCategory ?? undefined, search: search || undefined });

  const providers = providersQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Request Care"
        description="Choose a category to find the right care for your loved ones"
      />

      {/* Categories */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="Care Categories" description="What kind of care do you need?" />
        {catLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] ?? Stethoscope;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(active ? null : cat.id)}
                  className={cn(
                    'flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all',
                    active ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary',
                  )}
                >
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', active ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                    <span className="text-xs text-muted-foreground">{cat.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Providers */}
      {selectedCategory && (
        <section className="flex flex-col gap-4">
          <SectionHeader
            title="Nearby Care Providers"
            description="Verified providers for your selected category"
            actions={
              <div className="w-full sm:w-64">
                <SearchBar value={search} onChange={setSearch} placeholder="Search providers…" />
              </div>
            }
          />
          {providersQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
            </div>
          ) : providers.length === 0 ? (
            <Card>
              <EmptyState
                icon={Stethoscope}
                title="No providers found"
                description="Try a different category or search term."
              />
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => (
                <Card key={provider.id} className="flex flex-col gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground">{provider.name}</span>
                        {provider.isVerified && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/10 text-success" title="Verified">
                            <Stethoscope className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      {provider.rating && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{provider.rating}</span> ★ ({provider.reviewCount ?? 0})
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="line-clamp-2 text-xs text-muted-foreground">{provider.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {provider.distanceKm != null && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="font-medium text-foreground">{provider.distanceKm} km</span> away
                      </div>
                    )}
                    {provider.estimatedArrivalMinutes != null && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        ~{provider.estimatedArrivalMinutes} min
                      </div>
                    )}
                    {provider.experienceYears != null && (
                      <div className="text-muted-foreground">{provider.experienceYears} yrs exp</div>
                    )}
                    {provider.startingPrice != null && (
                      <div className="text-muted-foreground">From {provider.currency} {provider.startingPrice}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium',
                      provider.availability === 'available' && 'bg-success/10 text-success',
                      provider.availability === 'busy' && 'bg-warning/10 text-warning',
                      provider.availability === 'offline' && 'bg-muted text-muted-foreground',
                    )}>
                      {provider.availability === 'available' ? 'Available' : provider.availability === 'busy' ? 'Busy' : 'Offline'}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/portal/family/request-care/${provider.id}`)}>
                      View profile <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default RequestCarePage;
