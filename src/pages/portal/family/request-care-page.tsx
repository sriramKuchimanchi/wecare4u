import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Stethoscope, Building2, HeartPulse, Users, Pill, FlaskConical, Ambulance, Car,
  Zap, Wrench, Home, Activity, ArrowRight, HandHeart, Filter, Star, Clock, MapPin, CheckCircle, Shield, Plus,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState, SearchBar } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/shared/skeleton';
import { useCareCategories, useCareProviders } from '@/hooks/use-family-portal';
import { RequestCareWizardModal } from '@/components/care-coordination/RequestCareWizardModal';
import { cn } from '@/lib/utils';
import type { LucideIcon } from '@/config/icons';

const iconMap: Record<string, LucideIcon> = {
  Stethoscope, Building2, HeartPulse, Users, Pill, FlaskConical, Ambulance, Car,
  Zap, Wrench, Home, Activity, HandHeart,
};

export const RequestCarePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCat || null);
  const [search, setSearch] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [preselectedProviderId, setPreselectedProviderId] = useState<string | undefined>();

  // Filter criteria states
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories = [], isLoading: catLoading } = useCareCategories();
  const providersQuery = useCareProviders({ category: selectedCategory ?? undefined, search: search || undefined });

  let providers = providersQuery.data?.data ?? [];

  // Apply frontend filters
  if (availabilityFilter !== 'all') {
    providers = providers.filter((p) => p.availability === availabilityFilter);
  }
  if (minRating > 0) {
    providers = providers.filter((p) => (p.rating ?? 0) >= minRating);
  }
  if (maxDistance < 20) {
    providers = providers.filter((p) => (p.distanceKm ?? 0) <= maxDistance);
  }

  const handleStartWizard = (providerId?: string) => {
    if (providerId) setPreselectedProviderId(providerId);
    setWizardOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Request Care"
        description="Connect with top verified healthcare and service providers for your family"
        actions={
          <Button onClick={() => handleStartWizard()} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-md">
            <Plus className="mr-1.5 h-4 w-4" /> Start Care Request
          </Button>
        }
      />

      {/* Categories Grid */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Care Categories"
          description="Choose a category to discover verified professionals"
        />
        {catLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
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
                    'flex flex-col items-start gap-2.5 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-sm',
                    active ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary'
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', active ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}>
                      <Icon className="h-5 w-5" />
                    </span>
                    {cat.estimatedResponseTime && (
                      <span className="text-2xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                        ~{cat.estimatedResponseTime}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-foreground">{cat.label}</span>
                    <span className="text-2xs text-muted-foreground line-clamp-1">{cat.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Search & Filter Controls */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-80">
            <SearchBar value={search} onChange={setSearch} placeholder="Search providers, services..." />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5"
            >
              <Filter className="h-4 w-4" /> Filters {showFilters && 'Active'}
            </Button>
            {selectedCategory && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="text-xs text-muted-foreground">
                Clear Category ({selectedCategory})
              </Button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="grid gap-4 p-4 sm:grid-cols-3 bg-muted/20">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Availability</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-surface px-3 text-xs focus:border-primary focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="h-9 rounded-lg border border-input bg-surface px-3 text-xs focus:border-primary focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5 Stars & Above</option>
                <option value={4.0}>4.0 Stars & Above</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Max Distance ({maxDistance} km)</label>
              <input
                type="range"
                min={1}
                max={20}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="mt-2 h-2 accent-primary cursor-pointer"
              />
            </div>
          </Card>
        )}

        {/* Service Providers List */}
        <SectionHeader
              title={selectedCategory ? `Nearby ${selectedCategory.toUpperCase()} Service Providers` : 'All Verified Service Providers'}
          description="Browse profiles or launch a direct Care Request"
        />

        {providersQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52" />)}
          </div>
        ) : providers.length === 0 ? (
          <Card>
            <EmptyState
              icon={Stethoscope}
              title="No service providers found"
              description="Try adjusting your search query, filters, or selected care category."
              action={
                <Button size="sm" onClick={() => { setSelectedCategory(null); setSearch(''); setMinRating(0); setAvailabilityFilter('all'); }}>
                  Reset All Filters
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <Card key={provider.id} className="flex flex-col gap-3 p-4 transition-all hover:border-primary">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                    {provider.name.charAt(0)}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-foreground">{provider.name}</span>
                      {provider.isVerified && (
                        <Badge variant="secondary" className="px-1.5 py-0.5 text-2xs gap-0.5">
                          <Shield className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                    </div>
                    {provider.rating && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                        <span className="font-semibold text-foreground">{provider.rating}</span> ({provider.reviewCount ?? 0} reviews)
                      </span>
                    )}
                  </div>
                </div>

                <p className="line-clamp-2 text-xs text-muted-foreground">{provider.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {provider.distanceKm} km away</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-secondary" /> ~{provider.estimatedArrivalMinutes} min arrival</span>
                  <span>{provider.experienceYears} yrs exp</span>
                  <span className="font-bold text-primary">From {provider.currency} {provider.startingPrice}</span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-2xs capitalize',
                      provider.availability === 'available' && 'border-success text-success bg-success/5',
                      provider.availability === 'busy' && 'border-warning text-warning bg-warning/5',
                      provider.availability === 'offline' && 'border-muted text-muted-foreground'
                    )}
                  >
                    {provider.availability === 'available' ? 'Available Now' : provider.availability}
                  </Badge>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/portal/family/request-care/${provider.id}`)}>
                      Profile
                    </Button>
                    <Button size="sm" onClick={() => handleStartWizard(provider.id)} className="bg-primary text-primary-foreground font-bold">
                      Request Care
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 7-Step Care Request Wizard Modal */}
      <RequestCareWizardModal
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        initialCategory={selectedCategory || 'doctor'}
        initialProviderId={preselectedProviderId}
      />
    </div>
  );
};

export default RequestCarePage;
