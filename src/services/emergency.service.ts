import type { ApiResult, Emergency, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockEmergencies } from '@/utils/mock-data';

export const emergencyService = {
  async list(params: PaginationParams = {}): Promise<ApiResult<PaginatedResponse<Emergency>>> {
    return mockListRequest(mockEmergencies, { page: params.page, pageSize: params.pageSize });
  },
  async trigger(input: Omit<Emergency, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<ApiResult<Emergency>> {
    const emergency: Emergency = {
      ...input,
      id: createId('emr'),
      status: 'triggered',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    return mockRequest(emergency, { latency: 250 });
  },
  async updateStatus(id: string, status: Emergency['status']): Promise<ApiResult<Emergency>> {
    const emergency = mockEmergencies.find((e) => e.id === id);
    if (!emergency) return { success: false, error: { code: 'NOT_FOUND', message: 'Emergency not found' } };
    return mockRequest({ ...emergency, status, updatedAt: nowISO() });
  },
  unwrap,
};
