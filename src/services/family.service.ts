import type { ApiResult, FamilyMember, Family, PaginatedResponse } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockFamilies, mockFamilyMembers } from '@/utils/mock-data';

const members = [...mockFamilyMembers];
const families = [...mockFamilies];

export const familyService = {
  async getMyFamily(userId: string): Promise<ApiResult<Family>> {
    const family = families.find((f) => f.userId === userId) ?? families[0];
    return mockRequest(family, { latency: 350 });
  },
  async list(): Promise<ApiResult<PaginatedResponse<Family>>> {
    return mockListRequest(families);
  },
  async get(id: string): Promise<ApiResult<Family>> {
    const f = families.find((x) => x.id === id);
    if (!f) return { success: false, error: { code: 'NOT_FOUND', message: 'Family not found' } };
    return mockRequest(f);
  },
  async listMembers(familyId: string): Promise<ApiResult<FamilyMember[]>> {
    const result = members.filter((m) => m.familyId === familyId);
    return mockRequest(result, { latency: 300 });
  },
  async getMember(memberId: string): Promise<ApiResult<FamilyMember>> {
    const m = members.find((x) => x.id === memberId);
    if (!m) return { success: false, error: { code: 'NOT_FOUND', message: 'Member not found' } };
    return mockRequest(m);
  },
  async addMember(familyId: string, input: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt' | 'familyId'>): Promise<ApiResult<FamilyMember>> {
    const member: FamilyMember = { ...input, id: createId('mem'), familyId, createdAt: nowISO(), updatedAt: nowISO() };
    members.push(member);
    return mockRequest(member, { latency: 500 });
  },
  async updateMember(memberId: string, patch: Partial<FamilyMember>): Promise<ApiResult<FamilyMember>> {
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Member not found' } };
    members[idx] = { ...members[idx], ...patch, updatedAt: nowISO() };
    return mockRequest(members[idx], { latency: 400 });
  },
  async removeMember(memberId: string): Promise<ApiResult<{ ok: true }>> {
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx !== -1) members.splice(idx, 1);
    return mockRequest({ ok: true as const }, { latency: 300 });
  },
  unwrap,
};
