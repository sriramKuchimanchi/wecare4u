import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PortalHeader } from './portal-header';
import { PortalSidebar } from './portal-sidebar';
import { PortalBottomNav } from './portal-bottom-nav';
import { Breadcrumb, type BreadcrumbItem } from './portal-breadcrumb';
import { useAuth } from '@/hooks/use-auth';
import { useIsDesktop } from '@/hooks/use-media-query';
import { ROUTES } from '@/constants/routes';
import { PORTAL_LABELS, ROLE_LABELS } from '@/constants';
import { portalPathForRole } from '@/constants/routes';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const buildBreadcrumbs = (role: string, pathname: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    { label: PORTAL_LABELS[role as keyof typeof PORTAL_LABELS] ?? 'Portal', to: portalPathForRole(role as never) },
  ];
  const segments = pathname.split('/').filter(Boolean).slice(2);
  segments.forEach((seg, idx) => {
    const isLast = idx === segments.length - 1;
    const path = `/${['portal', role, ...segments.slice(0, idx + 1)].join('/')}`;
    items.push({
      label: seg
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' '),
      to: isLast ? undefined : path,
    });
  });
  return items;
};

export const PortalLayout = () => {
  const { role, isAuthenticated } = useAuth();
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.login, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!role) return null;

  const breadcrumbs = buildBreadcrumbs(role, location.pathname);

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <div className={cn('hidden w-64 shrink-0 border-r border-border lg:block')}>
        <div className="sticky top-0 h-dvh">
          <PortalSidebar />
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <PortalSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalHeader onToggleSidebar={() => setMobileOpen(true)} />

        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3 md:px-6">
          <Breadcrumb items={breadcrumbs} />
        </div>

        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-6 md:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-6xl animate-fade-in-up">
            <Outlet />
          </div>
        </main>

        <PortalBottomNav />
      </div>
    </div>
  );
};

export default PortalLayout;
