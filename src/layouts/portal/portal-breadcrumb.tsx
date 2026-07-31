import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from '@/config/icons';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <Fragment key={`${item.label}-${idx}`}>
            {item.to && !isLast ? (
              <Link to={item.to} className="text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
