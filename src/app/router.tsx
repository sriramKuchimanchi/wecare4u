import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { PublicLayout } from '@/layouts/public/public-layout';
import { PortalLayout } from '@/layouts/portal/portal-layout';
import {
  LandingPage, LoginPage, RegisterPage, FamilyRegisterPage, ProviderRegisterPage,
  ForgotPasswordPage, OnboardingPage, PortalPage, NotFoundPage,
} from '@/pages';
import { RequireAuth, RedirectIfAuth, RequireOnboarding } from '@/components/shared/route-guards';
import { ROUTES } from '@/constants/routes';

export const routes: RouteObject[] = [
  {
    path: ROUTES.landing,
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  {
    path: ROUTES.login,
    element: <RedirectIfAuth><LoginPage /></RedirectIfAuth>,
  },
  {
    path: ROUTES.register,
    element: <RedirectIfAuth><RegisterPage /></RedirectIfAuth>,
  },
  {
    path: '/register/family',
    element: <RedirectIfAuth><FamilyRegisterPage /></RedirectIfAuth>,
  },
  {
    path: '/register/care-provider',
    element: <RedirectIfAuth><ProviderRegisterPage /></RedirectIfAuth>,
  },
  {
    path: '/forgot-password',
    element: <RedirectIfAuth><ForgotPasswordPage /></RedirectIfAuth>,
  },
  {
    path: '/onboarding',
    element: <RequireOnboarding><OnboardingPage /></RequireOnboarding>,
  },
  {
    path: '/portal/:role',
    element: (
      <RequireAuth>
        <PortalLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <PortalPage /> },
      { path: '*', element: <PortalPage /> },
    ],
  },
  {
    path: ROUTES.notFound,
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);

export default router;
