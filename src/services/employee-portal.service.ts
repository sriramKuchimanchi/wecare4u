import type {
  ApiResult,
  CareRequest,
  CareRequestStatus,
  Employee,
  EmployeeAvailabilityStatus,
  ServiceNote,
} from '@/types';
import { mockRequest, createId, nowISO } from '@/lib/mock-api';
import {
  mockCareRequests,
  mockEmployees,
  mockServiceNotes,
  mockNotifications,
} from '@/utils/mock-data';

let requestsStore: CareRequest[] = [...mockCareRequests];
let employeesStore: Employee[] = [...mockEmployees];
let serviceNotesStore: ServiceNote[] = [...mockServiceNotes];

export const employeePortalService = {
  // ── Employee Profile & Status ─────────────────────────────────────────────
  async getEmployeeProfile(employeeId = 'emp_1'): Promise<ApiResult<Employee>> {
    const found = employeesStore.find((e) => e.id === employeeId) ?? employeesStore[0];
    return mockRequest(found, { latency: 200 });
  },

  async updateEmployeeStatus(employeeId: string, status: EmployeeAvailabilityStatus): Promise<ApiResult<Employee>> {
    const idx = employeesStore.findIndex((e) => e.id === employeeId);
    if (idx !== -1) {
      employeesStore[idx] = {
        ...employeesStore[idx],
        availability: status,
        updatedAt: nowISO(),
      };
      return mockRequest(employeesStore[idx], { latency: 300 });
    }
    const defaultEmp = { ...employeesStore[0], availability: status, updatedAt: nowISO() };
    return mockRequest(defaultEmp, { latency: 300 });
  },

  // ── Dashboard Overview ────────────────────────────────────────────────────
  async getEmployeeDashboard(employeeId = 'emp_1') {
    const assignedRequests = requestsStore.filter((r) => r.employeeId === employeeId || !r.employeeId);
    const today = new Date().toISOString().split('T')[0];
    const todaySchedule = assignedRequests.filter((r) => r.scheduledAt.startsWith(today) || r.status !== 'completed');
    const employee = employeesStore.find((e) => e.id === employeeId) ?? employeesStore[0];

    return mockRequest(
      {
        employee,
        todaySchedule,
        assignedRequests,
        upcomingVisits: todaySchedule.filter((r) => r.status !== 'completed'),
        notifications: mockNotifications.filter((n) => n.userId === 'user_employee_1' || n.type === 'info'),
      },
      { latency: 300 }
    );
  },

  // ── Requests & Workflow Operations ─────────────────────────────────────────
  async getAssignedRequests(employeeId = 'emp_1') {
    const list = requestsStore.filter((r) => r.employeeId === employeeId || r.status === 'accepted');
    return mockRequest(list, { latency: 250 });
  },

  async getRequestDetails(requestId: string): Promise<ApiResult<{ request: CareRequest; notes?: ServiceNote }>> {
    const req = requestsStore.find((r) => r.id === requestId);
    if (!req) return { success: false, error: { code: 'NOT_FOUND', message: 'Care request not found' } };
    const notes = serviceNotesStore.find((n) => n.requestId === requestId);
    return mockRequest({ request: req, notes }, { latency: 200 });
  },

  async acceptAssignment(requestId: string, employeeId = 'emp_1'): Promise<ApiResult<CareRequest>> {
    const idx = requestsStore.findIndex((r) => r.id === requestId);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };

    const employee = employeesStore.find((e) => e.id === employeeId) ?? employeesStore[0];
    const now = nowISO();
    const timeline = requestsStore[idx].timeline ? [...requestsStore[idx].timeline!] : [];
    timeline.push({
      status: 'employee_assigned',
      title: 'Assignment Accepted',
      description: `${employee.name} accepted the request assignment.`,
      timestamp: now,
    });

    requestsStore[idx] = {
      ...requestsStore[idx],
      employeeId: employee.id,
      employeeName: employee.name,
      employeeRole: employee.role,
      employeePhone: employee.contact.phone,
      status: 'employee_assigned',
      timeline,
      updatedAt: now,
    };
    return mockRequest(requestsStore[idx], { latency: 350 });
  },

  async updateWorkflowStatus(requestId: string, nextStatus: CareRequestStatus, stepNote?: string): Promise<ApiResult<CareRequest>> {
    const idx = requestsStore.findIndex((r) => r.id === requestId);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };

    const now = nowISO();
    const titleMap: Record<string, string> = {
      on_the_way: 'Professional On The Way',
      arrived: 'Arrived at Patient Home',
      in_progress: 'Care Service Started',
      completed: 'Service Completed',
      awaiting_review: 'Awaiting Family Review',
    };

    const timeline = requestsStore[idx].timeline ? [...requestsStore[idx].timeline!] : [];
    timeline.push({
      status: nextStatus,
      title: titleMap[nextStatus] ?? nextStatus,
      description: stepNote ?? `Status updated to ${nextStatus.replace(/_/g, ' ')} by field staff`,
      timestamp: now,
    });

    requestsStore[idx] = {
      ...requestsStore[idx],
      status: nextStatus,
      timeline,
      updatedAt: now,
    };
    return mockRequest(requestsStore[idx], { latency: 350 });
  },

  // ── Service Notes ────────────────────────────────────────────────────────
  async submitServiceNotes(input: Omit<ServiceNote, 'id' | 'createdAt'>): Promise<ApiResult<ServiceNote>> {
    const now = nowISO();
    const newNote: ServiceNote = {
      ...input,
      id: createId('sn'),
      createdAt: now,
    };
    serviceNotesStore.unshift(newNote);

    // Automatically mark request as completed/awaiting review
    const reqIdx = requestsStore.findIndex((r) => r.id === input.requestId);
    if (reqIdx !== -1) {
      const timeline = requestsStore[reqIdx].timeline ? [...requestsStore[reqIdx].timeline!] : [];
      timeline.push({
        status: 'completed',
        title: 'Service Visit Completed',
        description: 'Service completed. Care visit notes submitted by staff.',
        timestamp: now,
      });
      requestsStore[reqIdx] = {
        ...requestsStore[reqIdx],
        status: 'completed',
        timeline,
        updatedAt: now,
      };
    }

    return mockRequest(newNote, { latency: 450 });
  },
};

export default employeePortalService;
