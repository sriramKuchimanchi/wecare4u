import type { ApiResult, CareRequest, CareRequestStatus, CareProvider } from '@/types';
import { mockRequest } from '@/lib/mock-api';
import { mockCareProviders } from '@/utils/mock-data';
import { careRequestRepository } from '@/services/central-repository';

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

// Care requests are read from and written to the central repository so every
// portal (family, provider, admin) always sees the same live data — see
// central-repository.ts for the single source of truth.
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
    const list = careRequestRepository.getAll({ familyId }).data;
    return mockRequest(list, { latency: 300 });
  },

  async get(id: string): Promise<ApiResult<CareRequest>> {
    const found = careRequestRepository.getById(id);
    if (!found) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };
    return mockRequest(found, { latency: 250 });
  },

  async submit(input: Omit<CareRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<CareRequest>> {
    const provider = mockCareProviders.find((p) => p.id === input.providerId);
    const newReq = careRequestRepository.create({
      ...input,
      providerName: provider?.name ?? input.providerName ?? 'Verified Service Provider',
      categoryLabel: input.categoryLabel || (input.category ? input.category.charAt(0).toUpperCase() + input.category.slice(1) : 'General Care'),
      estimatedArrivalMinutes: provider?.estimatedArrivalMinutes ?? 25,
    });
    return mockRequest(newReq, { latency: 500 });
  },

  async updateStatus(id: string, status: CareRequestStatus, note?: string): Promise<ApiResult<CareRequest>> {
    const updated = careRequestRepository.updateStatus(id, status, { note });
    if (!updated) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };
    return mockRequest(updated, { latency: 350 });
  },
};

export default careRequestService;
