import type { ApiResult, Employee, PaginatedResponse, PaginationParams } from '@/types';
import { mockRequest, mockListRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockEmployees } from '@/utils/mock-data';

export const employeeService = {
  async list(params: PaginationParams = {}): Promise<ApiResult<PaginatedResponse<Employee>>> {
    return mockListRequest(mockEmployees, { page: params.page, pageSize: params.pageSize });
  },
  async get(id: string): Promise<ApiResult<Employee>> {
    const employee = mockEmployees.find((e) => e.id === id);
    if (!employee) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };
    return mockRequest(employee);
  },
  async create(input: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<Employee>> {
    const employee: Employee = { ...input, id: createId('emp'), createdAt: nowISO(), updatedAt: nowISO() };
    return mockRequest(employee);
  },
  async update(id: string, patch: Partial<Employee>): Promise<ApiResult<Employee>> {
    const employee = mockEmployees.find((e) => e.id === id);
    if (!employee) return { success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } };
    return mockRequest({ ...employee, ...patch, updatedAt: nowISO() });
  },
  async remove(id: string): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 150 });
  },
  unwrap,
};
