/**
 * Admin Portal Service — delegates to Central Data Repository.
 * All reads & writes go through the single source of truth.
 */

import { mockRequest } from '@/lib/mock-api';
import {
  familyRepository,
  providerRepository,
  employeeRepository,
  careRequestRepository,
  emergencyRepository,
  notificationRepository,
  timelineRepository,
  analyticsRepository,
  searchRepository,
  documentRepository,
  reviewRepository,
  categoryRepository,
} from '@/services/central-repository';
import { mockVerificationQueue, mockPlatformSettings } from '@/utils/mock-data';

const ok = <T>(data: T) => ({ success: true as const, data });

export const adminPortalService = {
  // ── Dashboard ───────────────────────────────────────────────────────────
  async getDashboardStats() {
    const stats = analyticsRepository.getDashboardStats();
    return mockRequest(stats, { latency: 300 });
  },

  // ── Families ─────────────────────────────────────────────────────────────
  async getFamilies(filters?: { search?: string; status?: string; page?: number }) {
    const result = familyRepository.getAll(filters);
    return mockRequest(result.data, { latency: 300 });
  },

  async getFamilyById(id: string) {
    const family = familyRepository.getById(id);
    return mockRequest(family, { latency: 300 });
  },

  // ── Providers ────────────────────────────────────────────────────────────
  async getProviders(filters?: { search?: string; verificationStatus?: string; page?: number }) {
    const result = providerRepository.getAll(filters);
    return mockRequest(result.data, { latency: 300 });
  },

  async getProviderById(id: string) {
    const provider = providerRepository.getById(id);
    return mockRequest(provider, { latency: 300 });
  },

  async approveProvider(id: string) {
    await new Promise(r => setTimeout(r, 400));
    providerRepository.approve(id);
    return ok({ success: true });
  },

  async rejectProvider(id: string, reason: string) {
    await new Promise(r => setTimeout(r, 400));
    providerRepository.reject(id, reason);
    return ok({ success: true });
  },

  async suspendProvider(id: string) {
    await new Promise(r => setTimeout(r, 400));
    providerRepository.suspend(id);
    return ok({ success: true });
  },

  // ── Employees ────────────────────────────────────────────────────────────
  async getAdminEmployees(filters?: { search?: string; verificationStatus?: string; page?: number }) {
    const result = employeeRepository.getAll(filters);
    return mockRequest(result.data, { latency: 300 });
  },

  async getAdminEmployeeById(id: string) {
    const emp = employeeRepository.getById(id);
    return mockRequest(emp, { latency: 300 });
  },

  async approveEmployee(id: string) {
    await new Promise(r => setTimeout(r, 400));
    employeeRepository.approve(id);
    return ok({ success: true });
  },

  async suspendEmployee(id: string) {
    await new Promise(r => setTimeout(r, 400));
    employeeRepository.suspend(id);
    return ok({ success: true });
  },

  // ── Care Requests ────────────────────────────────────────────────────────
  async getAdminCareRequests(filters?: { search?: string; status?: string; priority?: string; page?: number }) {
    const result = careRequestRepository.getAll(filters);
    return mockRequest(result.data, { latency: 300 });
  },

  // ── Emergencies ──────────────────────────────────────────────────────────
  async getEmergencies(filters?: { status?: string; familyId?: string }) {
    const result = emergencyRepository.getAll(filters);
    return mockRequest(result, { latency: 200 });
  },

  async getEmergencyById(id: string) {
    const emergency = emergencyRepository.getById(id);
    return mockRequest(emergency, { latency: 200 });
  },

  // ── Verification ─────────────────────────────────────────────────────────
  async getVerificationQueue(filters?: { status?: string; entityType?: string }) {
    let data = [...mockVerificationQueue];
    if (filters?.status && filters.status !== 'all') {
      data = data.filter((v: any) => v.status === filters.status);
    }
    if (filters?.entityType && filters.entityType !== 'all') {
      data = data.filter((v: any) => v.entityType === filters.entityType);
    }
    return mockRequest(data, { latency: 300 });
  },

  async approveVerification(id: string) {
    await new Promise(r => setTimeout(r, 400));
    const item = mockVerificationQueue.find((v: any) => v.id === id);
    if (item) { (item as any).status = 'approved'; }
    return ok({ success: true });
  },

  async rejectVerification(id: string, reason: string) {
    await new Promise(r => setTimeout(r, 400));
    const item = mockVerificationQueue.find((v: any) => v.id === id);
    if (item) { (item as any).status = 'rejected'; (item as any).rejectionReason = reason; }
    return ok({ success: true });
  },

  // ── Documents ────────────────────────────────────────────────────────────
  async getAdminDocuments(filters?: { search?: string; type?: string }) {
    const result = documentRepository.getAll(filters);
    return mockRequest(result.data, { latency: 300 });
  },

  async verifyDocument(id: string) {
    await new Promise(r => setTimeout(r, 400));
    documentRepository.verify(id);
    return ok({ success: true });
  },

  // ── Reviews ──────────────────────────────────────────────────────────────
  async getAdminReviews(filters?: { search?: string; status?: string; page?: number }) {
    const result = reviewRepository.getAll(filters);
    return mockRequest(result.data, { latency: 300 });
  },

  async flagReview(id: string) {
    await new Promise(r => setTimeout(r, 300));
    reviewRepository.flag(id);
    return ok({ success: true });
  },

  async resolveReview(id: string) {
    await new Promise(r => setTimeout(r, 300));
    reviewRepository.resolve(id);
    return ok({ success: true });
  },

  // ── Notifications ────────────────────────────────────────────────────────
  async getAdminNotifications(filters?: { type?: string; page?: number }) {
    const result = notificationRepository.getAdminNotifications(filters);
    return mockRequest(result.data, { latency: 200 });
  },

  async markNotificationRead(id: string) {
    await new Promise(r => setTimeout(r, 100));
    notificationRepository.markRead(id);
    return ok({ success: true });
  },

  async markAllNotificationsRead() {
    await new Promise(r => setTimeout(r, 200));
    notificationRepository.markAllRead('user_admin_1');
    return ok({ success: true });
  },

  // ── Categories ───────────────────────────────────────────────────────────
  async getCategories() {
    const cats = categoryRepository.getAll();
    return mockRequest(cats, { latency: 200 });
  },

  async toggleCategory(id: string) {
    await new Promise(r => setTimeout(r, 200));
    categoryRepository.toggle(id);
    return ok({ success: true });
  },

  async createCategory(data: any) {
    await new Promise(r => setTimeout(r, 300));
    const cat = categoryRepository.create(data);
    return ok(cat);
  },

  async updateCategory(id: string, patch: any) {
    await new Promise(r => setTimeout(r, 300));
    return ok({ success: true });
  },

  async deleteCategory(id: string) {
    await new Promise(r => setTimeout(r, 200));
    return ok({ success: true });
  },

  // ── Timeline ─────────────────────────────────────────────────────────────
  async getPlatformTimeline(filters?: { search?: string; type?: string; page?: number; pageSize?: number }) {
    const result = timelineRepository.getAll(filters);
    return mockRequest(result, { latency: 300 });
  },

  // ── Analytics ────────────────────────────────────────────────────────────
  async getAnalytics() {
    const analytics = analyticsRepository.getAnalytics();
    return mockRequest(analytics, { latency: 400 });
  },

  // ── Settings ─────────────────────────────────────────────────────────────
  async getSettings() {
    return mockRequest(mockPlatformSettings, { latency: 200 });
  },

  async updateSettings(patch: any) {
    await new Promise(r => setTimeout(r, 300));
    Object.assign(mockPlatformSettings as any, patch);
    return ok(mockPlatformSettings);
  },

  // ── Global Search ─────────────────────────────────────────────────────────
  async globalSearch(query: string) {
    await new Promise(r => setTimeout(r, 200));
    return ok(searchRepository.globalSearch(query));
  },
};
