import { useState } from 'react';
import { Activity, Filter } from '@/config/icons';
import { PageHeader, EmptyState, TimelineItem } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton, SkeletonText } from '@/components/shared/skeleton';
import { useTimeline } from '@/hooks/use-family-portal';
import { formatDate } from '@/utils/date';
import { cn } from '@/lib/utils';
import type { TimelineEntry } from '@/types';

type FilterKey = 'all' | 'today' | 'yesterday' | 'older';

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'older', label: 'Older' },
];

const getDayKey = (iso: string): FilterKey => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'today';
  if (date.toDateString() === yesterday.toDateString()) return 'yesterday';
  return 'older';
};

const groupTimeline = (entries: TimelineEntry[]) => {
  const groups: Record<string, TimelineEntry[]> = { today: [], yesterday: [], older: [] };
  entries.forEach((e) => groups[getDayKey(e.createdAt)].push(e));
  return groups;
};

export const FamilyTimelinePage = () => {
  const { data: timeline = [], isLoading } = useTimeline();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = filter === 'all' ? timeline : timeline.filter((e) => getDayKey(e.createdAt) === filter);
  const groups = groupTimeline(filtered);
  const groupLabels: Record<string, string> = { today: 'Today', yesterday: 'Yesterday', older: 'Older' };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Health Timeline"
        description="A complete history of care events for your family"
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonText lines={6} />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Activity}
            title="No timeline entries"
            description="Care events will appear here as they happen — appointments, deliveries, lab results and more."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {(['today', 'yesterday', 'older'] as const).map((key) => {
            const items = groups[key];
            if (items.length === 0) return null;
            return (
              <section key={key} className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{groupLabels[key]}</h2>
                <Card className="p-5">
                  <ol className="flex flex-col">
                    {items.map((entry, idx) => (
                      <TimelineItem
                        key={entry.id}
                        title={entry.title}
                        description={entry.description}
                        timestamp={entry.createdAt}
                        tone="primary"
                        isLast={idx === items.length - 1}
                        icon={Activity}
                      />
                    ))}
                  </ol>
                </Card>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FamilyTimelinePage;
