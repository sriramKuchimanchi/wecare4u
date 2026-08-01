import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Calendar, Stethoscope, FileText, ArrowRight } from '@/config/icons';
import { PageHeader, EmptyState, SearchBar } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/skeleton';
import { useFamilyMembers, useAppointments, useCareProviders } from '@/hooks/use-family-portal';
import { formatDate, formatTime } from '@/utils/date';
import { cn } from '@/lib/utils';
import type { LucideIcon } from '@/config/icons';

type SearchCategory = 'all' | 'providers' | 'members' | 'appointments';

const categoryTabs: { key: SearchCategory; label: string; icon: LucideIcon }[] = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'providers', label: 'Providers', icon: Stethoscope },
  { key: 'members', label: 'Members', icon: Users },
  { key: 'appointments', label: 'Appointments', icon: Calendar },
];

export const FamilySearchPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const navigate = useNavigate();

  const membersQuery = useFamilyMembers();
  const appointmentsQuery = useAppointments();
  const providersQuery = useCareProviders({ search: query || undefined });

  const members = membersQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];
  const providers = providersQuery.data?.data ?? [];

  const q = query.toLowerCase().trim();
  const hasQuery = q.length > 0;

  const matchedMembers = hasQuery ? members.filter((m) => m.name.toLowerCase().includes(q) || m.relationship.toLowerCase().includes(q)) : [];
  const matchedAppointments = hasQuery ? appointments.filter((a) => a.serviceType.toLowerCase().includes(q) || a.providerName.toLowerCase().includes(q)) : [];
  const matchedProviders = hasQuery ? providers.filter((p) => p.name.toLowerCase().includes(q) || p.services.some((s) => s.toLowerCase().includes(q))) : [];

  const showMembers = category === 'all' || category === 'members';
  const showAppointments = category === 'all' || category === 'appointments';
  const showProviders = category === 'all' || category === 'providers';

  const noResults = hasQuery && matchedMembers.length === 0 && matchedAppointments.length === 0 && matchedProviders.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Search" description="Find providers, services, members and appointments" />

      <SearchBar value={query} onChange={setQuery} placeholder="Search everything…" autoFocus />

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setCategory(tab.key)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              category === tab.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70',
            )}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {!hasQuery ? (
        <Card>
          <EmptyState
            icon={Search}
            title="Start searching"
            description="Search for service providers, services, family members or appointments."
          />
        </Card>
      ) : noResults ? (
        <Card>
          <EmptyState
            icon={Search}
            title="No results found"
            description={`Nothing matched "${query}". Try a different search term.`}
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Providers */}
          {showProviders && matchedProviders.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Providers</h2>
              {matchedProviders.map((p) => (
                <Card key={p.id} className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.services.join(' · ')}</span>
                  </div>
                  <button type="button" onClick={() => navigate(`/portal/family/request-care/${p.id}`)} className="text-primary">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Card>
              ))}
            </section>
          )}

          {/* Members */}
          {showMembers && matchedMembers.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Family Members</h2>
              {matchedMembers.map((m) => (
                <Card key={m.id} className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold text-foreground">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.relationship}</span>
                  </div>
                  <button type="button" onClick={() => navigate(`/portal/family/members/${m.id}`)} className="text-primary">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Card>
              ))}
            </section>
          )}

          {/* Appointments */}
          {showAppointments && matchedAppointments.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Appointments</h2>
              {matchedAppointments.map((a) => (
                <Card key={a.id} className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold text-foreground">{a.serviceType}</span>
                    <span className="text-xs text-muted-foreground">{a.providerName}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">{formatDate(a.scheduledAt, 'MMM d')}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(a.scheduledAt)}</span>
                  </div>
                </Card>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilySearchPage;
