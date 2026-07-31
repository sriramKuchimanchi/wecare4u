import type { ApiResult, CareRequest, Appointment, PaginatedResponse } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockCareRequests, mockAppointments } from '@/utils/mock-data';

const requests = [...mockCareRequests];
const appointments = [...mockAppointments];

export const bookingService = {
  async listRequests(familyId: string): Promise<ApiResult<CareRequest[]>> {
    const items = requests.filter((r) => r.familyId === familyId);
    return mockRequest(items, { latency: 350 });
  },
  async submitRequest(input: Omit<CareRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<CareRequest>> {
    const req: CareRequest = { ...input, id: createId('cr'), createdAt: nowISO(), updatedAt: nowISO() };
    requests.push(req);
    return mockRequest(req, { latency: 600 });
  },
  async cancelRequest(id: string): Promise<ApiResult<{ ok: true }>> {
    const idx = requests.findIndex((r) => r.id === id);
    if (idx !== -1) requests[idx] = { ...requests[idx], status: 'cancelled', updatedAt: nowISO() };
    return mockRequest({ ok: true as const }, { latency: 300 });
  },
  async listAppointments(familyId: string): Promise<ApiResult<Appointment[]>> {
    const items = appointments.filter((a) => a.familyId === familyId);
    return mockRequest(items, { latency: 350 });
  },
  async listUpcomingAppointments(familyId: string): Promise<ApiResult<Appointment[]>> {
    const now = new Date();
    const items = appointments.filter((a) => a.familyId === familyId && a.status === 'upcoming' && new Date(a.scheduledAt) >= now);
    return mockRequest(items, { latency: 300 });
  },
  unwrap,
};
