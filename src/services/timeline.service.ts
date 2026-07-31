import type { ApiResult, TimelineEntry, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockTimeline } from '@/utils/mock-data';

export const timelineService = {
  async list(familyId: string, params: PaginationParams = {}): Promise<ApiResult<PaginatedResponse<TimelineEntry>>> {
    const items = mockTimeline.filter((t) => t.familyId === familyId);
    return mockListRequest(items, { page: params.page, pageSize: params.pageSize });
  },
  async add(input: Omit<TimelineEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<TimelineEntry>> {
    const entry: TimelineEntry = { ...input, id: createId('tl'), createdAt: nowISO(), updatedAt: nowISO() };
    return mockRequest(entry);
  },
  unwrap,
};
