import type { ApiResult, CareProvider, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockCareProviders } from '@/utils/mock-data';

export const careProviderService = {
  async list(params: PaginationParams = {}): Promise<ApiResult<PaginatedResponse<CareProvider>>> {
    return mockListRequest(mockCareProviders, { page: params.page, pageSize: params.pageSize });
  },
  async get(id: string): Promise<ApiResult<CareProvider>> {
    const provider = mockCareProviders.find((p) => p.id === id);
    if (!provider) return { success: false, error: { code: 'NOT_FOUND', message: 'Provider not found' } };
    return mockRequest(provider);
  },
  async create(input: Omit<CareProvider, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<CareProvider>> {
    const provider: CareProvider = { ...input, id: createId('prov'), createdAt: nowISO(), updatedAt: nowISO() };
    return mockRequest(provider);
  },
  async update(id: string, patch: Partial<CareProvider>): Promise<ApiResult<CareProvider>> {
    const provider = mockCareProviders.find((p) => p.id === id);
    if (!provider) return { success: false, error: { code: 'NOT_FOUND', message: 'Provider not found' } };
    return mockRequest({ ...provider, ...patch, updatedAt: nowISO() });
  },
  async remove(id: string): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 150 });
  },
  unwrap,
};
