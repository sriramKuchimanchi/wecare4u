import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from '@/config/icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_TAGLINE } from '@/constants';
import { cn } from '@/lib/utils';
import { usePwaInstallPrompt } from '@/hooks/use-pwa-install';

type PublicHeaderProps = {
  onOpenMenu?: () => void;
  className?: string;
};

export const PublicHeader = ({ className }: PublicHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { canInstall, promptInstall } = usePwaInstallPrompt();
  const closeMenu = () => setMenuOpen(false);
  const location = useLocation();
  const isSignupPage = location.pathname.startsWith('/register');
  const isLoginPage = location.pathname.startsWith('/login');

  return (
  <header className={cn('sticky top-0 z-[100] w-full border-b border-border/60 bg-background/95 backdrop-blur-md safe-top', className)}>
    <div className="public-landing-container relative flex h-16 items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
        <img src="/logo.png" alt="We Care For You" className="h-11 w-11 object-contain" />
        <span className="flex flex-col leading-none">
          <span className="text-base font-bold text-foreground">{APP_NAME}</span>
          <span className="hidden text-2xs text-muted-foreground sm:block">{APP_TAGLINE}</span>
        </span>
        </Link>
      </div>

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
        {!isLoginPage && (
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Login</Link>
          </Button>
        )}
        {!isSignupPage && (
          <Button asChild size="sm">
            <Link to="/register">Get started</Link>
          </Button>
        )}
      </div>
      {menuOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+1px)] z-[110] border-b border-border bg-background p-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {[
              { label: 'Home', to: '/' },
              { label: 'Services', to: '/#services' },
              { label: 'For Families', to: '/#families' },
              { label: 'For Providers', to: '/#providers' },
            ].map((item) => <Link key={item.to} to={item.to} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted">{item.label}</Link>)}
          </nav>
          <div className={cn('mt-3 grid gap-2 border-t border-border pt-3', isSignupPage || isLoginPage ? 'grid-cols-1' : 'grid-cols-2')}>
            {!isLoginPage && (
              <Button asChild variant="outline" className="h-12" onClick={closeMenu}><Link to="/login">Login</Link></Button>
            )}
            {!isSignupPage && (
              <Button asChild className="h-12" onClick={closeMenu}><Link to="/register">Sign up</Link></Button>
            )}
          </div>
          {canInstall && <Button type="button" variant="ghost" className="mt-2 h-12 w-full" onClick={() => promptInstall()}>Install app</Button>}
        </div>
      )}
    </div>
  </header>
  );
};

export default PublicHeader;
