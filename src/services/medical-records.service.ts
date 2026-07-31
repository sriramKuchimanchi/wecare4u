import type { ApiResult, MedicalRecord, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockMedicalRecords } from '@/utils/mock-data';

export const medicalRecordsService = {
  async list(memberId: string, params: PaginationParams = {}): Promise<ApiResult<PaginatedResponse<MedicalRecord>>> {
    const items = mockMedicalRecords.filter((r) => r.familyMemberId === memberId);
    return mockListRequest(items, { page: params.page, pageSize: params.pageSize });
  },
  async get(id: string): Promise<ApiResult<MedicalRecord>> {
    const record = mockMedicalRecords.find((r) => r.id === id);
    if (!record) return { success: false, error: { code: 'NOT_FOUND', message: 'Record not found' } };
    return mockRequest(record);
  },
  async create(input: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<MedicalRecord>> {
    const record: MedicalRecord = { ...input, id: createId('rec'), createdAt: nowISO(), updatedAt: nowISO() };
    return mockRequest(record);
  },
  async update(id: string, patch: Partial<MedicalRecord>): Promise<ApiResult<MedicalRecord>> {
    const record = mockMedicalRecords.find((r) => r.id === id);
    if (!record) return { success: false, error: { code: 'NOT_FOUND', message: 'Record not found' } };
    return mockRequest({ ...record, ...patch, updatedAt: nowISO() });
  },
  async remove(id: string): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 150 });
  },
  unwrap,
};
