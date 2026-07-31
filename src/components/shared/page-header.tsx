import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, actions, className }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-3 pb-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
        {description && <p className="text-sm text-muted-foreground md:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  ),
);
PageHeader.displayName = 'PageHeader';
