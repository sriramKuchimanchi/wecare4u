import type { ApiResult, Notification, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockNotifications } from '@/utils/mock-data';

export const notificationService = {
  async list(userId: string, params: PaginationParams = {}): Promise<ApiResult<PaginatedResponse<Notification>>> {
    const items = mockNotifications.filter((n) => n.userId === userId);
    return mockListRequest(items, { page: params.page, pageSize: params.pageSize });
  },
  async markRead(id: string): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 120 });
  },
  async markAllRead(userId: string): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 120 });
  },
  async create(input: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<Notification>> {
    const notification: Notification = { ...input, id: createId('notif'), createdAt: nowISO(), updatedAt: nowISO() };
    return mockRequest(notification);
  },
  unwrap,
};
