import { forwardRef } from 'react';
import type { PaginationParams } from '@/types';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from './skeleton';
import { EmptyState } from './empty-state';
import { Pagination } from './pagination';
import { cn } from '@/lib/utils';

export type DataTableColumn<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  className?: string;
  rowKey?: (row: T) => string;
};

export function DataTable<T extends Record<string, unknown>>(
  {
    columns, data, isLoading, emptyTitle = 'No results', emptyDescription = 'Try adjusting your filters or search.',
    page, pageSize, total, totalPages, onPageChange, onRowClick, className, rowKey,
  }: DataTableProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const showPagination = Boolean(page && totalPages && total && onPageChange);

  return (
    <div ref={ref} className={cn('flex flex-col overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`} className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      <Skeleton className="h-4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow
                  key={rowKey ? rowKey(row) : `row-${i}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className={col.className}>
                      {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '—')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <Pagination
          page={page!}
          totalPages={totalPages!}
          pageSize={pageSize ?? 20}
          total={total!}
          onPageChange={onPageChange!}
          className="border-t border-border"
        />
      )}
    </div>
  );
}

export const DataTableForwarded = forwardRef(DataTable) as <T extends Record<string, unknown>>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export default DataTableForwarded;
export type { PaginationParams };
