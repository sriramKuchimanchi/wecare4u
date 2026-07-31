import { Heart } from '@/config/icons';
import { APP_NAME } from '@/constants';

export const FullScreenLoader = ({ label = 'Loading…' }: { label?: string }) => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background">
    <div className="relative flex h-16 w-16 items-center justify-center">
      <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-floating">
        <Heart className="h-6 w-6" />
      </span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <p className="text-sm font-semibold text-foreground">{APP_NAME}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default FullScreenLoader;
