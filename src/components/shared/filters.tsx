import { forwardRef } from 'react';
import { Filter as FilterIcon, X } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FilterDefinition = {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
};

export type FiltersProps = {
  filters: FilterDefinition[];
  onClear?: () => void;
  className?: string;
};

const NativeSelect = ({ filter }: { filter: FilterDefinition }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground" htmlFor={`filter-${filter.id}`}>
      {filter.label}
    </label>
    <select
      id={`filter-${filter.id}`}
      value={filter.value ?? ''}
      onChange={(e) => filter.onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
    >
      <option value="">All</option>
      {filter.options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

export const Filters = forwardRef<HTMLDivElement, FiltersProps>(
  ({ filters, onClear, className }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-3 rounded-lg border border-border bg-surface p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          Filters
        </div>
        {onClear && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-xs text-muted-foreground">
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {filters.map((f) => (
          <NativeSelect key={f.id} filter={f} />
        ))}
      </div>
    </div>
  ),
);
Filters.displayName = 'Filters';
