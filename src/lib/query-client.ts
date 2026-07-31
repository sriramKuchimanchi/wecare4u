import { QueryClient } from '@tanstack/react-query';
import { API_TIMEOUT_MS } from '@/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, API_TIMEOUT_MS),
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
