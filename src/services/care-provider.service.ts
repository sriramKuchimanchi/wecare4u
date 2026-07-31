import type { ApiResult, CareProvider, CareCategory, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap } from '@/lib/mock-api';
import { mockCareProviders, mockCareCategories } from '@/utils/mock-data';

export const careProviderService = {
  async listCategories(): Promise<ApiResult<CareCategory[]>> {
    return mockRequest(mockCareCategories, { latency: 200 });
  },
  async list(params: PaginationParams & { category?: string } = {}): Promise<ApiResult<PaginatedResponse<CareProvider>>> {
    let items = [...mockCareProviders];
    if (params.category) {
      const catMap: Record<string, string[]> = {
        doctor: ['doctor'], hospital: ['hospital'], 'home-nurse': ['home-care', 'nursing'],
        caregiver: ['caregiver', 'home-care'], medicine: ['pharmacy'],
        laboratory: ['laboratory'], ambulance: ['emergency'], transport: ['transport'],
        physiotherapy: ['physiotherapy'], housekeeping: ['housekeeping'],
        electrician: ['electrician'], plumber: ['plumber'],
      };
      const types = catMap[params.category] ?? [params.category];
      items = items.filter((p) => types.includes(p.type));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q) || p.services.some((s) => s.toLowerCase().includes(q)));
    }
    return mockListRequest(items, { page: params.page, pageSize: params.pageSize });
  },
  async get(id: string): Promise<ApiResult<CareProvider>> {
    const p = mockCareProviders.find((x) => x.id === id);
    if (!p) return { success: false, error: { code: 'NOT_FOUND', message: 'Provider not found' } };
    return mockRequest(p, { latency: 300 });
  },
  unwrap,
};
