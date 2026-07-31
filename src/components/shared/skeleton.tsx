import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
};

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, rounded = 'md' }, ref) => (
    <div ref={ref} className={cn('skeleton-shimmer h-4 w-full', roundedMap[rounded], className)} />
  ),
);
Skeleton.displayName = 'Skeleton';

export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn('flex flex-col gap-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={cn(i === lines - 1 ? 'w-2/3' : 'w-full')} />
    ))}
  </div>
);
