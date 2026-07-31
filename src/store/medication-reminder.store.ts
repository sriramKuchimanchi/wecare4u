import { create } from 'zustand';
import type { MedicationReminder, MedicationStatus } from '@/types';

type MedicationReminderState = {
  reminders: MedicationReminder[];
  isLoading: boolean;
};

type MedicationReminderActions = {
  setReminders: (reminders: MedicationReminder[]) => void;
  updateStatus: (id: string, status: MedicationStatus) => void;
};

export type MedicationReminderStore = MedicationReminderState & MedicationReminderActions;

const initialReminders: MedicationReminder[] = [
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    lastActionAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useMedicationReminderStore = create<MedicationReminderStore>((set) => ({
  reminders: initialReminders,
  isLoading: false,
  setReminders: (reminders) => set({ reminders }),
  updateStatus: (id, status) =>
    set((s) => ({
      reminders: s.reminders.map((m) =>
        m.id === id ? { ...m, status, lastActionAt: new Date().toISOString() } : m
      ),
    })),
}));

export default useMedicationReminderStore;
