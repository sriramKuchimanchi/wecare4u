import type { ApiResult, CareRequest, CareRequestStatus, CareProvider } from '@/types';
import { mockRequest, createId, nowISO } from '@/lib/mock-api';
import { mockCareRequests, mockCareProviders } from '@/utils/mock-data';

const requests: CareRequest[] = [...mockCareRequests];

export type ProviderFilterOptions = {
  category?: string;
  search?: string;
  maxDistanceKm?: number;
  availability?: 'available' | 'busy' | 'offline' | 'all';
  minRating?: number;
  maxPrice?: number;
  maxResponseTimeMinutes?: number;
  serviceType?: string;
};

export const careRequestService = {
  async filterProviders(options: ProviderFilterOptions = {}): Promise<ApiResult<CareProvider[]>> {
    let result = [...mockCareProviders];

    if (options.category) {
      result = result.filter(
        (p) => p.type === options.category || p.services.some((s) => s.toLowerCase().includes(options.category!.toLowerCase()))
      );
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.services.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (options.availability && options.availability !== 'all') {
      result = result.filter((p) => p.availability === options.availability);
    }

    if (options.minRating) {
      result = result.filter((p) => (p.rating ?? 0) >= options.minRating!);
    }

    if (options.maxDistanceKm) {
      result = result.filter((p) => (p.distanceKm ?? 0) <= options.maxDistanceKm!);
    }

    if (options.maxPrice) {
      result = result.filter((p) => (p.startingPrice ?? 0) <= options.maxPrice!);
    }

    if (options.maxResponseTimeMinutes) {
      result = result.filter((p) => (p.estimatedArrivalMinutes ?? 999) <= options.maxResponseTimeMinutes!);
    }

    return mockRequest(result, { latency: 300 });
  },

  async list(familyId = 'fam_1'): Promise<ApiResult<CareRequest[]>> {
    const list = requests.filter((r) => r.familyId === familyId);
    return mockRequest(list, { latency: 300 });
  },

  async get(id: string): Promise<ApiResult<CareRequest>> {
    const req = requests.find((r) => r.id === id);
    if (!req) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };
    return mockRequest(req, { latency: 250 });
  },

  async submit(input: Omit<CareRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<CareRequest>> {
    const now = nowISO();
    const provider = mockCareProviders.find((p) => p.id === input.providerId);
    const newReq: CareRequest = {
      ...input,
      id: createId('req'),
      providerName: provider?.name ?? input.providerName ?? 'Verified Service Provider',
      categoryLabel: input.category ? input.category.charAt(0).toUpperCase() + input.category.slice(1) : 'General Care',
      estimatedArrivalMinutes: provider?.estimatedArrivalMinutes ?? 25,
      timeline: [
        {
          status: 'requested',
          title: 'Care Request Submitted',
          description: 'Request submitted. Provider notified for acceptance.',
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    requests.unshift(newReq);
    return mockRequest(newReq, { latency: 500 });
  },

  async updateStatus(id: string, status: CareRequestStatus, note?: string): Promise<ApiResult<CareRequest>> {
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };

    const now = nowISO();
    const titleMap: Record<CareRequestStatus, string> = {
      requested: 'Care Request Submitted',
      accepted: 'Care Request Accepted',
      employee_assigned: 'Employee Assigned',
      professional_assigned: 'Professional Assigned',
      on_the_way: 'Professional On The Way',
      arrived: 'Professional Arrived',
      in_progress: 'Care Service In Progress',
      completed: 'Care Service Completed',
      cancelled: 'Care Request Cancelled',
      pending: 'Pending Review',
      awaiting_review: 'Awaiting Review',
    };

    const currentTimeline = requests[idx].timeline ? [...requests[idx].timeline!] : [];
    currentTimeline.push({
      status,
      title: titleMap[status] ?? status,
      description: note ?? `Status updated to ${status.replace('_', ' ')}`,
      timestamp: now,
    });

    requests[idx] = {
      ...requests[idx],
      status,
      timeline: currentTimeline,
      updatedAt: now,
    };

    return mockRequest(requests[idx], { latency: 400 });
  },
};

export default careRequestService;
