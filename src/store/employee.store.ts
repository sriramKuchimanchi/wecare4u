import { create } from 'zustand';
import type { Employee } from '@/types';

type EmployeeState = {
  employees: Employee[];
  currentEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
};

type EmployeeActions = {
  setEmployees: (employees: Employee[]) => void;
  setCurrentEmployee: (employee: Employee | null) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export type EmployeeStore = EmployeeState & EmployeeActions;

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  isLoading: false,
  error: null,
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  ...initialState,
  setEmployees: (employees) => set({ employees }),
  setCurrentEmployee: (currentEmployee) => set({ currentEmployee }),
  addEmployee: (employee) => set((s) => ({ employees: [...s.employees, employee] })),
  updateEmployee: (id, patch) =>
    set((s) => ({
      employees: s.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      currentEmployee:
        s.currentEmployee?.id === id ? { ...s.currentEmployee, ...patch } : s.currentEmployee,
    })),
  removeEmployee: (id) =>
    set((s) => ({
      employees: s.employees.filter((e) => e.id !== id),
      currentEmployee: s.currentEmployee?.id === id ? null : s.currentEmployee,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState }),
}));

export default useEmployeeStore;
