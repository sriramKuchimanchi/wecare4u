import { useState } from 'react';
import { User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type AppAvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  className?: string;
  fallbackType?: 'user' | 'building' | 'initials';
  fallbackClassName?: string;
  iconClassName?: string;
};

export const AppAvatar = ({
  src,
  alt,
  name,
  className,
  fallbackType = 'initials',
  fallbackClassName,
  iconClassName,
}: AppAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (str?: string) => {
    if (!str) return '';
    const parts = str.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name || alt);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold overflow-hidden select-none border border-primary/15',
          className,
          fallbackClassName
        )}
      >
        {fallbackType === 'building' ? (
          <Building2 className={cn('h-1/2 w-1/2 text-primary', iconClassName)} />
        ) : initials ? (
          <span className="tracking-tight">{initials}</span>
        ) : (
          <User className={cn('h-1/2 w-1/2 text-primary', iconClassName)} />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || name || 'Avatar'}
      onError={() => setHasError(true)}
      className={cn('shrink-0 object-cover', className)}
    />
  );
};

export default AppAvatar;
