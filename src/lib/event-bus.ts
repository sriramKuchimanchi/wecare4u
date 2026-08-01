import { QueryClient } from '@tanstack/react-query';

type EventListener = (data?: any) => void;

class EventBus {
  private listeners: Record<string, EventListener[]> = {};
  private queryClient: QueryClient | null = null;

  setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  on(event: string, fn: EventListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
    return () => this.off(event, fn);
  }

  off(event: string, fn: EventListener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((l) => l !== fn);
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }

    // Automatically invalidate TanStack Query caches across all portals
    if (this.queryClient) {
      this.invalidateAllPortals();
    }
  }

  invalidateAllPortals() {
    if (!this.queryClient) return;
    this.queryClient.invalidateQueries({ queryKey: ['provider'] });
    this.queryClient.invalidateQueries({ queryKey: ['employee'] });
    this.queryClient.invalidateQueries({ queryKey: ['admin'] });
    this.queryClient.invalidateQueries({ queryKey: ['family'] });
    this.queryClient.invalidateQueries({ queryKey: ['care-request'] });
    this.queryClient.invalidateQueries({ queryKey: ['emergency'] });
    this.queryClient.invalidateQueries({ queryKey: ['notifications'] });
    this.queryClient.invalidateQueries({ queryKey: ['timeline'] });
  }
}

export const eventBus = new EventBus();
export default eventBus;
