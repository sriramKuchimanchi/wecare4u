import type { ApiResult, Family, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockFamilies } from '@/utils/mock-data';

export const familyService = {
  async list(params: PaginationParams = {}): Promise<ApiResult<PaginatedResponse<Family>>> {
    return mockListRequest(mockFamilies, { page: params.page, pageSize: params.pageSize });
  },
  async get(id: string): Promise<ApiResult<Family>> {
    const family = mockFamilies.find((f) => f.id === id);
    if (!family) return { success: false, error: { code: 'NOT_FOUND', message: 'Family not found' } };
    return mockRequest(family);
  },
  async create(input: Omit<Family, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<Family>> {
    const family: Family = { ...input, id: createId('fam'), createdAt: nowISO(), updatedAt: nowISO() };
    return mockRequest(family);
  },
  async update(id: string, patch: Partial<Family>): Promise<ApiResult<Family>> {
    const family = mockFamilies.find((f) => f.id === id);
    if (!family) return { success: false, error: { code: 'NOT_FOUND', message: 'Family not found' } };
    return mockRequest({ ...family, ...patch, updatedAt: nowISO() });
  },
  async remove(id: string): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 150 });
  },
  unwrap,
};
