import type { ApiResult, TimelineEntry, PaginatedResponse } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockTimeline } from '@/utils/mock-data';

const entries = [...mockTimeline];

export const timelineService = {
  async list(familyId: string): Promise<ApiResult<TimelineEntry[]>> {
    const items = entries.filter((t) => t.familyId === familyId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return mockRequest(items, { latency: 350 });
  },
  async add(input: Omit<TimelineEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<TimelineEntry>> {
    const entry: TimelineEntry = { ...input, id: createId('tl'), createdAt: nowISO(), updatedAt: nowISO() };
    entries.unshift(entry);
    return mockRequest(entry, { latency: 200 });
  },
  unwrap,
};
