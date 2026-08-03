import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AppHeader } from '../app-header';
import { PublicFooter } from './public-footer';

export const PublicLayout = () => (
  <div className="flex min-h-dvh flex-col bg-background">
    <AppHeader variant="public" />
    <main className="flex-1">
      <Outlet />
    </main>
    <PublicFooter />
    <ScrollRestoration />
  </div>
);

export default PublicLayout;
