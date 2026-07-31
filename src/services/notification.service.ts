import type { ApiResult, Notification } from '@/types';
import { mockRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockNotifications } from '@/utils/mock-data';

const notifications = [...mockNotifications];

export const notificationService = {
  async list(userId: string): Promise<ApiResult<Notification[]>> {
    const items = notifications.filter((n) => n.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return mockRequest(items, { latency: 300 });
  },
  async markRead(id: string): Promise<ApiResult<{ ok: true }>> {
    const n = notifications.find((x) => x.id === id);
    if (n) n.read = true;
    return mockRequest({ ok: true as const }, { latency: 100 });
  },
  async markAllRead(userId: string): Promise<ApiResult<{ ok: true }>> {
    notifications.filter((n) => n.userId === userId).forEach((n) => { n.read = true; });
    return mockRequest({ ok: true as const }, { latency: 100 });
  },
  async remove(id: string): Promise<ApiResult<{ ok: true }>> {
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx !== -1) notifications.splice(idx, 1);
    return mockRequest({ ok: true as const }, { latency: 100 });
  },
  async create(input: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<Notification>> {
    const n: Notification = { ...input, id: createId('notif'), createdAt: nowISO(), updatedAt: nowISO() };
    notifications.unshift(n);
    return mockRequest(n, { latency: 100 });
  },
  unwrap,
};
