import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyService } from '@/services/family.service';
import { careProviderService } from '@/services/care-provider.service';
import { bookingService } from '@/services/booking.service';
import { timelineService } from '@/services/timeline.service';
import { notificationService } from '@/services/notification.service';
import { useAuthStore } from '@/store';
import { useNotificationStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import type { FamilyMember, CareRequest } from '@/types';

const FAMILY_ID = 'fam_1'; // resolved from auth in a real app

// ── Family ──────────────────────────────────────────────────────────────────

export function useMyFamily() {
  const userId = useAuthStore((s) => s.user?.id ?? 'user_family_1');
  return useQuery({
    queryKey: ['family', 'mine', userId],
    queryFn: () => familyService.getMyFamily(userId),
    select: (r) => r.data,
  });
}

export function useFamilyMembers(familyId = FAMILY_ID) {
  return useQuery({
    queryKey: ['family', 'members', familyId],
    queryFn: () => familyService.listMembers(familyId),
    select: (r) => r.data ?? [],
  });
}

export function useFamilyMember(memberId: string) {
  return useQuery({
    queryKey: ['family', 'member', memberId],
    queryFn: () => familyService.getMember(memberId),
    select: (r) => r.data,
    enabled: Boolean(memberId),
  });
}

export function useAddMemberMutation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt' | 'familyId'>) =>
      familyService.addMember(FAMILY_ID, input),
    onSuccess: (result) => {
      if (result.success) {
        qc.invalidateQueries({ queryKey: ['family', 'members'] });
        toast({ title: 'Member added', description: 'Family member has been added successfully.' });
      }
    },
  });
}

export function useUpdateMemberMutation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<FamilyMember> }) =>
      familyService.updateMember(id, patch),
    onSuccess: (result) => {
      if (result.success) {
        qc.invalidateQueries({ queryKey: ['family', 'members'] });
        qc.invalidateQueries({ queryKey: ['family', 'member', result.data?.id] });
        toast({ title: 'Member updated', description: 'Profile saved successfully.' });
      }
    },
  });
}

export function useRemoveMemberMutation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (memberId: string) => familyService.removeMember(memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['family', 'members'] });
      toast({ title: 'Member removed', description: 'Family member has been removed.' });
    },
  });
}

// ── Care Categories & Providers ───────────────────────────────────────────

export function useCareCategories() {
  return useQuery({
    queryKey: ['care-categories'],
    queryFn: () => careProviderService.listCategories(),
    select: (r) => r.data ?? [],
    staleTime: 1000 * 60 * 10,
  });
}

export function useCareProviders(params: { category?: string; search?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ['care-providers', params],
    queryFn: () => careProviderService.list(params),
    select: (r) => r.data,
  });
}

export function useCareProvider(id: string) {
  return useQuery({
    queryKey: ['care-provider', id],
    queryFn: () => careProviderService.get(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

// ── Care Requests & Appointments ──────────────────────────────────────────

export function useCareRequests(familyId = FAMILY_ID) {
  return useQuery({
    queryKey: ['care-requests', familyId],
    queryFn: () => bookingService.listRequests(familyId),
    select: (r) => r.data ?? [],
  });
}

export function useSubmitCareRequestMutation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: Omit<CareRequest, 'id' | 'createdAt' | 'updatedAt'>) =>
      bookingService.submitRequest(input),
    onSuccess: (result) => {
      if (result.success) {
        qc.invalidateQueries({ queryKey: ['care-requests'] });
        qc.invalidateQueries({ queryKey: ['timeline'] });
        toast({ title: 'Care request submitted', description: 'Your request has been sent to the provider.' });
      }
    },
  });
}

export function useAppointments(familyId = FAMILY_ID) {
  return useQuery({
    queryKey: ['appointments', familyId],
    queryFn: () => bookingService.listAppointments(familyId),
    select: (r) => r.data ?? [],
  });
}

export function useUpcomingAppointments(familyId = FAMILY_ID) {
  return useQuery({
    queryKey: ['appointments', 'upcoming', familyId],
    queryFn: () => bookingService.listUpcomingAppointments(familyId),
    select: (r) => r.data ?? [],
  });
}

// ── Timeline ──────────────────────────────────────────────────────────────

export function useTimeline(familyId = FAMILY_ID) {
  return useQuery({
    queryKey: ['timeline', familyId],
    queryFn: () => timelineService.list(familyId),
    select: (r) => r.data ?? [],
  });
}

// ── Notifications ─────────────────────────────────────────────────────────

export function useNotifications() {
  const userId = useAuthStore((s) => s.user?.id ?? 'user_family_1');
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const r = await notificationService.list(userId);
      if (r.success && r.data) setNotifications(r.data);
      return r;
    },
    select: (r) => r.data ?? [],
    refetchInterval: 30000,
  });
}

export function useMarkNotificationReadMutation() {
  const qc = useQueryClient();
  const markRead = useNotificationStore((s) => s.markRead);
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onMutate: (id) => markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllReadMutation() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id ?? 'user_family_1');
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  return useMutation({
    mutationFn: () => notificationService.markAllRead(userId),
    onMutate: () => markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useRemoveNotificationMutation() {
  const qc = useQueryClient();
  const remove = useNotificationStore((s) => s.remove);
  return useMutation({
    mutationFn: (id: string) => notificationService.remove(id),
    onMutate: (id) => remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
