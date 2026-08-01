import type {
  ApiResult,
  CareRequest,
  CareRequestStatus,
  Employee,
  EmployeeAvailabilityStatus,
  ServiceNote,
} from '@/types';
import { mockRequest, createId, nowISO } from '@/lib/mock-api';
import { mockServiceNotes, mockNotifications } from '@/utils/mock-data';
import { careRequestRepository, employeeRepository } from '@/services/central-repository';

// Service notes are employee-portal-only (not cross-portal)
let serviceNotesStore: ServiceNote[] = [...mockServiceNotes];

export const employeePortalService = {
  // ── Employee Profile & Status ─────────────────────────────────────────────
  async getEmployeeProfile(employeeId = 'emp_1'): Promise<ApiResult<Employee>> {
    const found = employeeRepository.getById(employeeId) ?? employeeRepository.getAll().data[0];
    return mockRequest(found as Employee, { latency: 200 });
  },

  async updateEmployeeStatus(employeeId: string, status: EmployeeAvailabilityStatus): Promise<ApiResult<Employee>> {
    employeeRepository.updateAvailability(employeeId, status);
    const emp = employeeRepository.getById(employeeId) ?? employeeRepository.getAll().data[0];
    return mockRequest(emp as Employee, { latency: 300 });
  },

  // ── Dashboard Overview ────────────────────────────────────────────────────
  async getEmployeeDashboard(employeeId = 'emp_1') {
    const allRequests = careRequestRepository.getAll({ employeeId }).data;
    const today = new Date().toISOString().split('T')[0];
    const todaySchedule = allRequests.filter((r) => r.scheduledAt?.startsWith(today) || r.status !== 'completed');
    const employee = (employeeRepository.getById(employeeId) ?? employeeRepository.getAll().data[0]) as Employee;

    return mockRequest(
      {
        employee,
        todaySchedule,
        assignedRequests: allRequests,
        upcomingVisits: todaySchedule.filter((r) => r.status !== 'completed'),
        notifications: mockNotifications.filter((n) => n.userId === `user_employee_${employeeId}` || n.userId === 'user_employee_1'),
      },
      { latency: 300 }
    );
  },

  // ── Requests & Workflow Operations ─────────────────────────────────────────
  async getAssignedRequests(employeeId = 'emp_1') {
    const list = careRequestRepository.getAll({ employeeId }).data;
    // Also include accepted requests available for assignment
    const pending = careRequestRepository.getAll({ status: 'accepted' }).data.slice(0, 5);
    return mockRequest([...list, ...pending.filter((r) => !list.some((l) => l.id === r.id))], { latency: 250 });
  },

  async getRequestDetails(requestId: string): Promise<ApiResult<{ request: CareRequest; notes?: ServiceNote }>> {
    const req = careRequestRepository.getById(requestId);
    if (!req) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };
    const notes = serviceNotesStore.find((n) => n.requestId === requestId);
    return mockRequest({ request: req, notes }, { latency: 200 });
  },

  async acceptAssignment(requestId: string, employeeId = 'emp_1'): Promise<ApiResult<CareRequest>> {
    const employee = (employeeRepository.getById(employeeId) ?? employeeRepository.getAll().data[0]) as Employee;
    const updated = careRequestRepository.updateStatus(requestId, 'employee_assigned', {
      employeeId: employee.id,
      employeeName: employee.name,
      employeeRole: employee.role,
      employeePhone: employee.contact.phone,
      note: `${employee.name} accepted the request assignment.`,
    });
    if (!updated) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };
    return mockRequest(updated, { latency: 350 });
  },

  async updateWorkflowStatus(requestId: string, nextStatus: CareRequestStatus, stepNote?: string): Promise<ApiResult<CareRequest>> {
    const updated = careRequestRepository.updateStatus(requestId, nextStatus, {
      note: stepNote ?? `Status updated to ${nextStatus.replace(/_/g, ' ')} by field staff`,
    });
    if (!updated) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };
    return mockRequest(updated, { latency: 350 });
  },

  // ── Service Notes ────────────────────────────────────────────────────────
  async submitServiceNotes(input: Omit<ServiceNote, 'id' | 'createdAt'>): Promise<ApiResult<ServiceNote>> {
    const newNote: ServiceNote = { ...input, id: createId('sn'), createdAt: nowISO() };
    serviceNotesStore.unshift(newNote);

    // Automatically mark request as completed in the central repository (cross-portal sync)
    careRequestRepository.updateStatus(input.requestId, 'completed', {
      note: 'Service completed. Care visit notes submitted by field staff.',
    });

    return mockRequest(newNote, { latency: 450 });
  },
};

export default employeePortalService;
