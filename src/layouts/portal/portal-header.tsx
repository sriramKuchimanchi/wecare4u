import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Search, User, X } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { AppAvatar } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useNotificationStore } from '@/store';
import { APP_NAME, PORTAL_LABELS, ROLE_LABELS } from '@/constants';
import { cn } from '@/lib/utils';
import { GlobalSearchModal } from '@/components/shared/global-search-modal';
import type { UserRole } from '@/types';

type PortalHeaderProps = {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
  role?: UserRole;
  className?: string;
};

export const PortalHeader = ({ onToggleSidebar, isSidebarOpen = false, role: routeRole, className }: PortalHeaderProps) => {
  const { user, role: authRole, reset } = useAuth();
  const role = routeRole ?? authRole;
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [isSearchOpen, setIsSearchOpen] = useState(false);



  const handleLogout = () => {
    reset();
    navigate('/');
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
            <img src="/logo.png" alt="We Care For You" className="h-9 w-auto object-contain" />
            <span className="hidden text-base font-bold tracking-tight text-primary sm:block">{APP_NAME}</span>
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

export default PortalHeader;
