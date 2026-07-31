import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  divider?: boolean;
  className?: string;
};

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, description, actions, divider = false, className }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1 md:flex-row md:items-center md:justify-between', className)}>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
      {divider && <hr className="mt-4 border-border md:col-span-2" />}
    </div>
  ),
);
SectionHeader.displayName = 'SectionHeader';
