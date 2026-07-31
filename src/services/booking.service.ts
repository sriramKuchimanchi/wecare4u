import type { ApiResult, Booking, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockBookings } from '@/utils/mock-data';

export const bookingService = {
  async list(params: PaginationParams = {}): Promise<ApiResult<PaginatedResponse<Booking>>> {
    return mockListRequest(mockBookings, { page: params.page, pageSize: params.pageSize });
  },
  async get(id: string): Promise<ApiResult<Booking>> {
    const booking = mockBookings.find((b) => b.id === id);
    if (!booking) return { success: false, error: { code: 'NOT_FOUND', message: 'Booking not found' } };
    return mockRequest(booking);
  },
  async create(input: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<Booking>> {
    const booking: Booking = { ...input, id: createId('book'), createdAt: nowISO(), updatedAt: nowISO() };
    return mockRequest(booking);
  },
  async update(id: string, patch: Partial<Booking>): Promise<ApiResult<Booking>> {
    const booking = mockBookings.find((b) => b.id === id);
    if (!booking) return { success: false, error: { code: 'NOT_FOUND', message: 'Booking not found' } };
    return mockRequest({ ...booking, ...patch, updatedAt: nowISO() });
  },
  async remove(id: string): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 150 });
  },
  unwrap,
};
