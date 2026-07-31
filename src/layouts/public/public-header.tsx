import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_TAGLINE } from '@/constants';
import { cn } from '@/lib/utils';

type PublicHeaderProps = {
  onOpenMenu?: () => void;
  className?: string;
};

export const PublicHeader = ({ onOpenMenu, className }: PublicHeaderProps) => (
  <header className={cn('sticky top-0 z-header w-full border-b border-border/60 bg-background/80 backdrop-blur-md safe-top', className)}>
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
          <Heart className="h-5 w-5" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-base font-bold text-foreground">{APP_NAME}</span>
          <span className="hidden text-2xs text-muted-foreground sm:block">{APP_TAGLINE}</span>
        </span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {[
          { label: 'Home', to: '/' },
          { label: 'Services', to: '/#services' },
          { label: 'For Families', to: '/#families' },
          { label: 'For Providers', to: '/#providers' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )
            }
            end={item.to === '/'}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link to="/login">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/register">Get started</Link>
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMenu} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  </header>
);

export default PublicHeader;
