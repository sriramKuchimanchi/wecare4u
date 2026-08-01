import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { cn } from '@/lib/utils';
import { useAdminSearchQuery } from '@/hooks/use-portal-queries';
import { useDebounce } from '@/hooks/use-debounce';

type Result = { type: string; id: string; title: string; subtitle: string; url: string };

const TYPE_ICONS: Record<string, any> = {
  family: icons.Home,
  member: icons.User,
  provider: icons.Building2,
  employee: icons.Users,
  request: icons.FileText,
  timeline: icons.Activity,
};

const TYPE_COLORS: Record<string, string> = {
  family: 'bg-blue-500/10 text-blue-500',
  member: 'bg-purple-500/10 text-purple-500',
  provider: 'bg-green-500/10 text-green-500',
  employee: 'bg-amber-500/10 text-amber-500',
  request: 'bg-orange-500/10 text-orange-500',
  timeline: 'bg-slate-500/10 text-slate-500',
};

type Props = { onClose: () => void };

export const GlobalSearchModal = ({ onClose }: Props) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isFetching } = useAdminSearchQuery(debouncedQuery);
  const results: Result[] = (data as any)?.results ?? [];

  const handleSelect = useCallback((result: Result) => {
    navigate(result.url);
    onClose();
  }, [navigate, onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <icons.Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search families, providers, employees, requests…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {isFetching && (
            <icons.Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          >
            <icons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.length < 2 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <icons.Search className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Type at least 2 characters to search across the platform</p>
            </div>
          ) : results.length === 0 && !isFetching ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <icons.SearchX className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No results for "<span className="font-medium text-foreground">{query}</span>"</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => {
                const Icon = TYPE_ICONS[result.type] ?? icons.FileText;
                const colorClass = TYPE_COLORS[result.type] ?? 'bg-muted text-foreground';
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors group"
                  >
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{result.title}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{result.subtitle}</p>
                    </div>
                    <span className="shrink-0 text-2xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
                      {result.type}
                    </span>
                    <icons.ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">
            {results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Global search across all portals'}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-border px-1.5 py-0.5 font-mono text-xs">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-border px-1.5 py-0.5 font-mono text-xs">Esc</kbd> close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
