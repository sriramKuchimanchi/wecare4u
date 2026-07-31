import { Outlet, ScrollRestoration } from 'react-router-dom';
import { PublicHeader } from './public-header';
import { PublicFooter } from './public-footer';

export const PublicLayout = () => (
  <div className="flex min-h-dvh flex-col bg-background">
    <PublicHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <PublicFooter />
    <ScrollRestoration />
  </div>
);

export default PublicLayout;
