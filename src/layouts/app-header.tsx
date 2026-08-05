import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, Search, User, X } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { AppAvatar } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useNotificationStore } from '@/store';
import { APP_NAME, APP_TAGLINE, PORTAL_LABELS, ROLE_LABELS } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { GlobalSearchModal } from '@/components/shared/global-search-modal';
import { usePwaInstallPrompt } from '@/hooks/use-pwa-install';
import type { UserRole } from '@/types';

type AppHeaderProps =
  | {
      /** Public/marketing navbar — landing page and all pre-login auth pages. */
      variant: 'public';
      className?: string;
    }
  | {
      /** Authenticated app-shell navbar — the three portal dashboards. */
      variant: 'portal';
      onToggleSidebar: () => void;
      isSidebarOpen?: boolean;
      role?: UserRole;
      className?: string;
    };

/**
 * Single navbar component used everywhere in the app. Which variant renders
 * (and therefore what it looks like and does) depends on context: the public
 * marketing nav for the landing/auth pages, or the authenticated app-shell
 * nav for the portal dashboards. Each variant's behavior is unchanged from
 * before this file existed as two separate components.
 */
export const AppHeader = (props: AppHeaderProps) => {
  if (props.variant === 'portal') {
    return <PortalNavbar {...props} />;
  }
  return <PublicNavbar {...props} />;
};

const PublicNavbar = ({ className }: { className?: string }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { canInstall, promptInstall } = usePwaInstallPrompt();
  const closeMenu = () => setMenuOpen(false);
  const location = useLocation();
  const isSignupPage = location.pathname.startsWith('/register');
  const isLoginPage = location.pathname.startsWith('/login');

  return (
  <header className={cn('sticky top-0 z-[100] w-full border-b border-border/60 bg-background/95 backdrop-blur-md safe-top', (isLoginPage || isSignupPage) && 'hidden lg:block', className)}>
    <div className="public-landing-container relative flex h-16 items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
        <img src="/logo2.png" alt="We Care For You" className="h-11 w-11 object-contain" />
        <span className="flex flex-col leading-none">
          <span className="text-base font-bold text-foreground">{APP_NAME}</span>
          <span className="hidden text-2xs text-muted-foreground sm:block">{APP_TAGLINE}</span>
        </span>
        </Link>
      </div>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
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

type PortalNavbarProps = {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
  role?: UserRole;
  className?: string;
};

const PortalNavbar = ({ onToggleSidebar, isSidebarOpen = false, role: routeRole, className }: PortalNavbarProps) => {
  const { user, role: authRole, reset } = useAuth();
  const role = routeRole ?? authRole;
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    reset();
    navigate(ROUTES.login);
  };

  return (
    <>
      <header className={cn('sticky top-0 z-[100] flex min-h-16 items-center justify-between gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md safe-top md:px-6', className)}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo2.png" alt="We Care For You" className="h-9 w-auto object-contain" />
            <span className="text-base font-bold tracking-tight text-primary">{APP_NAME}</span>
          </Link>
          {role && (
            <Badge variant="secondary" className="hidden md:inline-flex">
              {PORTAL_LABELS[role]}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative" onClick={() => navigate(role ? `/portal/${role}/notifications` : '/login')}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-2xs font-bold text-secondary-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-0.5 hover:bg-muted" aria-label="Account menu">
                <AppAvatar
                  src={user?.avatarUrl}
                  name={user?.name}
                  className="h-9 w-9 rounded-full border border-border"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user?.name ?? 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                  {role && <span className="mt-1 text-xs text-muted-foreground">{ROLE_LABELS[role]}</span>}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(role ? `/portal/${role}/profile` : '/login')}>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {isSearchOpen && <GlobalSearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default AppHeader;
