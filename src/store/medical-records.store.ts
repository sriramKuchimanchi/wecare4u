import { create } from 'zustand';
import type { MedicalRecord } from '@/types';

type MedicalRecordsState = {
  records: MedicalRecord[];
  currentRecord: MedicalRecord | null;
  isLoading: boolean;
  error: string | null;
};

type MedicalRecordsActions = {
  setRecords: (records: MedicalRecord[]) => void;
  setCurrentRecord: (record: MedicalRecord | null) => void;
  addRecord: (record: MedicalRecord) => void;
  updateRecord: (id: string, patch: Partial<MedicalRecord>) => void;
  removeRecord: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export type MedicalRecordsStore = MedicalRecordsState & MedicalRecordsActions;

const initialState: MedicalRecordsState = {
  records: [],
  currentRecord: null,
  isLoading: false,
  error: null,
};

export const useMedicalRecordsStore = create<MedicalRecordsStore>((set) => ({
  ...initialState,
  setRecords: (records) => set({ records }),
  setCurrentRecord: (currentRecord) => set({ currentRecord }),
  addRecord: (record) => set((s) => ({ records: [record, ...s.records] })),
  updateRecord: (id, patch) =>
    set((s) => ({
      records: s.records.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      currentRecord:
        s.currentRecord?.id === id ? { ...s.currentRecord, ...patch } : s.currentRecord,
    })),
  removeRecord: (id) =>
    set((s) => ({
      records: s.records.filter((r) => r.id !== id),
      currentRecord: s.currentRecord?.id === id ? null : s.currentRecord,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState }),
}));

export default useMedicalRecordsStore;
