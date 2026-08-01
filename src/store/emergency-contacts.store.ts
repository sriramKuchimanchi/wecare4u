import { create } from 'zustand';
import type { EmergencyContact } from '@/types';

type EmergencyContactsState = {
  contacts: EmergencyContact[];
  isLoading: boolean;
  error: string | null;
};

type EmergencyContactsActions = {
  setContacts: (contacts: EmergencyContact[]) => void;
  addContact: (contact: EmergencyContact) => void;
  updateContact: (id: string, patch: Partial<EmergencyContact>) => void;
  deleteContact: (id: string) => void;
  setPrimary: (id: string) => void;
};

export type EmergencyContactsStore = EmergencyContactsState & EmergencyContactsActions;

const initialContacts: EmergencyContact[] = [
  { id: 'cnt_1', name: 'Aaradhya Rao', relationship: 'Daughter', phone: '+91 98200 12345', isPrimary: true, priority: 'primary', preferredLanguage: 'English' },
  { id: 'cnt_2', name: 'Raghav Rao', relationship: 'Son', phone: '+91 98200 98765', isPrimary: false, priority: 'secondary', preferredLanguage: 'English' },
  { id: 'cnt_3', name: 'Dr. Khalid Mansoor', relationship: 'Family Doctor', phone: '+971 4 222 3333', isPrimary: false, priority: 'normal', preferredLanguage: 'Arabic' },
];

export const useEmergencyContactsStore = create<EmergencyContactsStore>((set) => ({
  contacts: initialContacts,
  isLoading: false,
  error: null,
  setContacts: (contacts) => set({ contacts }),
  addContact: (contact) => set((s) => ({ contacts: [...s.contacts, contact] })),
  updateContact: (id, patch) =>
    set((s) => ({
      contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  deleteContact: (id) =>
    set((s) => ({
      contacts: s.contacts.filter((c) => c.id !== id),
    })),
  setPrimary: (id) =>
    set((s) => ({
      contacts: s.contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
        priority: c.id === id ? 'primary' : c.priority === 'primary' ? 'secondary' : c.priority,
      })),
    })),
}));

export default useEmergencyContactsStore;
