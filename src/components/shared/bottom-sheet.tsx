import { forwardRef } from 'react';
import { Loader2 } from '@/config/icons';
import { cn } from '@/lib/utils';

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Mobile-first bottom sheet built on top of the shadcn Drawer.
 * Kept dependency-light here so future prompts can swap implementations.
 */
export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ open, onClose, title, description, children, className }, ref) => {
    if (!open) return null;
    return (
      <div ref={ref} className={cn('fixed inset-0 z-drawer md:hidden', className)}>
        <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onClose} aria-hidden />
        <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-fade-in-up rounded-t-2xl bg-surface p-4 shadow-floating safe-bottom">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
          {(title || description) && (
            <div className="mb-3 flex flex-col gap-0.5">
              {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          )}
          <div className="overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  },
);
BottomSheet.displayName = 'BottomSheet';

export const LoadingOverlay = ({ label = 'Saving…' }: { label?: string }) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-lg bg-background/60 text-sm text-muted-foreground backdrop-blur-sm">
    <Loader2 className="h-4 w-4 animate-spin" />
    {label}
  </div>
);
