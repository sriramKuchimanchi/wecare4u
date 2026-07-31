import { forwardRef } from 'react';
import type { LucideIcon } from '@/config/icons';
import { cn } from '@/lib/utils';

type ChipTone = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

const toneClasses: Record<ChipTone, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
};

export type ChipProps = {
  label: string;
  tone?: ChipTone;
  icon?: LucideIcon;
  onRemove?: () => void;
  className?: string;
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ label, tone = 'default', icon: Icon, onRemove, className }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
          aria-label={`Remove ${label}`}
        >
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  ),
);
Chip.displayName = 'Chip';
