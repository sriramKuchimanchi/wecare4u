import { forwardRef } from 'react';
import type { PaginationParams } from '@/types';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ page, totalPages, pageSize, total, onPageChange, className }, ref) => {
    const canPrev = page > 1;
    const canNext = page < totalPages;

    return (
      <div ref={ref} className={cn('flex flex-col items-center gap-3 py-4 md:flex-row md:justify-between', className)}>
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{(page - 1) * (pageSize ?? 20) + 1}</span>
          {' – '}
          <span className="font-medium text-foreground">{Math.min(page * (pageSize ?? 20), total)}</span>
          {' of '}
          <span className="font-medium text-foreground">{total}</span>
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" disabled={!canPrev} onClick={() => onPageChange(1)} aria-label="First page">
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon-sm" disabled={!canPrev} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-3 text-sm font-medium text-foreground">
            {page} / {Math.max(1, totalPages)}
          </span>
          <Button variant="outline" size="icon-sm" disabled={!canNext} onClick={() => onPageChange(page + 1)} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon-sm" disabled={!canNext} onClick={() => onPageChange(totalPages)} aria-label="Last page">
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  },
);
Pagination.displayName = 'Pagination';

export type { PaginationParams };
