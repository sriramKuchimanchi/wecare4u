import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { PublicLayout } from '@/layouts/public/public-layout';
import { PortalLayout } from '@/layouts/portal/portal-layout';
import {
  LandingPage, LoginPage, RegisterPage, FamilyRegisterPage, ProviderRegisterPage,
  ForgotPasswordPage, OnboardingPage, NotFoundPage,
} from '@/pages';
import { PortalRouter } from '@/pages/portal/portal-router';
import { RequireAuth } from '@/components/shared/route-guards';
import { ROUTES } from '@/constants/routes';
import RootLayout from './root-layout';

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.landing,
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage /> },
        ],
      },
      {
        path: ROUTES.login,
        element: <LoginPage />,
      },
      {
        path: ROUTES.register,
        element: <RegisterPage />,
      },
      {
        path: '/register/family',
        element: <FamilyRegisterPage />,
      },
      {
        path: '/register/care-provider',
        element: <ProviderRegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/onboarding',
        element: <OnboardingPage />,
      },
      {
        path: '/portal/:role',
        element: <PortalLayout />,
        children: [
          { index: true, element: <PortalRouter /> },
          { path: '*', element: <PortalRouter /> },
        ],
      },
      {
        path: ROUTES.notFound,
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

export default router;
