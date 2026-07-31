import type { ApiResult, MedicationReminder, MedicationStatus } from '@/types';
import { mockRequest, nowISO } from '@/lib/mock-api';

const reminders: MedicationReminder[] = [
  {
    id: 'med_1',
    familyId: 'fam_1',
    memberId: 'mem_1',
    memberName: 'Mohammed Rahman',
    medicineName: 'Insulin (Humalog)',
    dosage: '10 Units',
    time: '08:00 AM',
    frequency: 'Daily with breakfast',
    status: 'pending',
    instructions: 'Monitor blood sugar before injecting',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: 'med_2',
    familyId: 'fam_1',
    memberId: 'mem_1',
    memberName: 'Mohammed Rahman',
    medicineName: 'Amlodipine (Norvasc)',
    dosage: '5 mg',
    time: '09:00 PM',
    frequency: 'Daily after dinner',
    status: 'pending',
    instructions: 'Take with full glass of water',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: 'med_3',
    familyId: 'fam_1',
    memberId: 'mem_2',
    memberName: 'Fatima Rahman',
    medicineName: 'Glucosamine Supplement',
    dosage: '500 mg',
    time: '02:00 PM',
    frequency: 'Daily after lunch',
    status: 'taken',
    instructions: 'Joint stiffness supplement',
    lastActionAt: nowISO(),
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

export const medicationService = {
  async list(familyId = 'fam_1'): Promise<ApiResult<MedicationReminder[]>> {
    const list = reminders.filter((m) => m.familyId === familyId);
    return mockRequest(list, { latency: 250 });
  },

  async updateStatus(id: string, status: MedicationStatus): Promise<ApiResult<MedicationReminder>> {
    const idx = reminders.findIndex((m) => m.id === id);
    if (idx === -1) return { success: false, error: { code: 'NOT_FOUND', message: 'Medication reminder not found' } };
    reminders[idx] = {
      ...reminders[idx],
      status,
      lastActionAt: nowISO(),
      updatedAt: nowISO(),
    };
    return mockRequest(reminders[idx], { latency: 300 });
  },
};

export default medicationService;
