import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PortalHeader } from './portal-header';
import { PortalSidebar } from './portal-sidebar';
import { PortalBottomNav } from './portal-bottom-nav';
import { Breadcrumb, type BreadcrumbItem } from './portal-breadcrumb';
import { useAuth } from '@/hooks/use-auth';
import { useIsDesktop } from '@/hooks/use-media-query';
import { ROUTES } from '@/constants/routes';
import { PORTAL_LABELS } from '@/constants';
import { portalPathForRole } from '@/constants/routes';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { FloatingEmergencyButton } from '@/components/care-coordination/FloatingEmergencyButton';
import { FloatingAiAssistantButton } from '@/components/care-coordination/FloatingAiAssistantButton';
import { AiAssistantDrawer } from '@/components/care-coordination/AiAssistantDrawer';
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
  const isFamily = role === 'family';

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Full-width top header */}
      <PortalHeader onToggleSidebar={() => setMobileOpen(true)} />

      {/* Mobile sidebar drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Mobile navigation sidebar</SheetDescription>
          </SheetHeader>
          <PortalSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Content row: sidebar + main */}
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden w-64 shrink-0 border-r border-border lg:block">
          <div className="sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto">
            <PortalSidebar />
          </div>
        </div>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3 md:px-6">
            <Breadcrumb items={breadcrumbs} />
          </div>

          <main className="flex-1 px-4 pb-24 pt-6 md:px-6 lg:px-8 lg:pb-8">
            <div className="mx-auto w-full max-w-6xl animate-fade-in-up">
              <Outlet />
            </div>
          </main>

          <PortalBottomNav />

          {/* Family Portal Floating Action Buttons & AI Drawer */}
          {isFamily && (
            <>
              <FloatingEmergencyButton />
              <FloatingAiAssistantButton />
              <AiAssistantDrawer />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalLayout;
