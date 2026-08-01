import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/query-client';
import { eventBus } from '@/lib/event-bus';
import { OfflineBanner } from '@/components/shared/offline-banner';
import { router } from './router';

export const App = () => {
  useEffect(() => {
    // Register query client on event bus for global cross-portal cache invalidation
    eventBus.setQueryClient(queryClient);

    // Register Service Worker for PWA capabilities
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA ServiceWorker registered:', reg.scope))
        .catch((err) => console.warn('ServiceWorker registration failed:', err));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <OfflineBanner />
    </QueryClientProvider>
  );
};

export default App;
