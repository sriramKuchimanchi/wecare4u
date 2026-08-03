import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PortalHeader } from './portal-header';
import { PortalSidebar } from './portal-sidebar';
import { PortalBottomNav } from './portal-bottom-nav';
import { Breadcrumb, type BreadcrumbItem } from './portal-breadcrumb';
import { useAuth } from '@/hooks/use-auth';
import { useIsDesktop } from '@/hooks/use-media-query';
import { PORTAL_LABELS } from '@/constants';
import { portalPathForRole } from '@/constants/routes';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { FloatingEmergencyButton } from '@/components/care-coordination/FloatingEmergencyButton';
import type { UserRole } from '@/types';

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
  const { role: storeRole } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const segments = location.pathname.split('/').filter(Boolean);
  const role = (segments[1] as UserRole) ?? storeRole ?? 'family';

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const breadcrumbs = buildBreadcrumbs(role, location.pathname);
  const isFamily = role === 'family';

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Full-width top header */}
      <PortalHeader
        role={role}
        onToggleSidebar={() => setMobileOpen((open) => !open)}
        isSidebarOpen={mobileOpen}
        className={mobileOpen ? 'bg-background backdrop-blur-none' : undefined}
      />

      {/* Mobile sidebar drawer */}
      {/* modal={false} keeps the header's own menu/close button interactive while the drawer is open
          (a modal Radix Dialog disables pointer-events outside its portal, which would swallow that click).
          Radix only renders its built-in overlay for modal dialogs, so we render the dim backdrop ourselves. */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} modal={false}>
        <SheetContent
          side="left"
          className="w-72 p-0"
          // Our own dim overlay above already closes the drawer on any outside click.
          // Without disabling Radix's own outside-interaction dismissal too, both it and the
          // header toggle button's onClick fire for the same click on that button (which sits
          // outside this portal — clicking it also focuses it, which Radix treats as an outside
          // interaction), racing each other and reopening the drawer.
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Mobile navigation sidebar</SheetDescription>
          </SheetHeader>
          <PortalSidebar
            role={role}
            onNavigate={() => setMobileOpen(false)}
            className="pt-[calc(4rem_+_env(safe-area-inset-top))]"
          />
        </SheetContent>
      </Sheet>

      {/* Content row: sidebar + main */}
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden w-64 shrink-0 border-r border-border lg:block">
          <div className="sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto">
            <PortalSidebar role={role} />
          </div>
        </div>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3 md:px-6">
            <Breadcrumb items={breadcrumbs} />
          </div>

          <main className="flex-1 overflow-x-hidden px-4 pb-24 pt-6 md:px-6 lg:px-8 lg:pb-8">
            <div className="mx-auto w-full max-w-6xl animate-fade-in-up">
              <Outlet />
            </div>
          </main>

          <PortalBottomNav />

          {/* Family Portal Floating Action Buttons */}
          {isFamily && <FloatingEmergencyButton />}
        </div>
      </div>
    </div>
  );
};

export default PortalLayout;
