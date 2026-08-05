import { create } from 'zustand';
import type { AiChatMessage, SmartActionCard } from '@/types';

type AiAssistantState = {
  messages: AiChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
};

type AiAssistantActions = {
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  addMessage: (msg: AiChatMessage) => void;
  setTyping: (typing: boolean) => void;
  resetChat: () => void;
};

export type AiAssistantStore = AiAssistantState & AiAssistantActions;

const initialMessages: AiChatMessage[] = [
  {
    id: 'msg_init',
    sender: 'assistant',
    text: "Hello Aisha! I am your AI Care Coordinator. How can I assist your family today? You can ask me for a doctor, home nurse, caregiver, emergency help, or medicine delivery.",
    timestamp: new Date().toISOString(),
    actions: [
      { id: 'act_1', label: 'Request Service', actionType: 'request_care', icon: 'HandHeart', tone: 'primary' },
      { id: 'act_2', label: 'Emergency SOS', actionType: 'emergency_sos', icon: 'Siren', tone: 'danger' },
      { id: 'act_3', label: 'Call Emergency Contact', actionType: 'call_emergency_contact', icon: 'Phone', tone: 'secondary' },
      { id: 'act_4', label: 'View Nearby Hospitals', actionType: 'view_nearby_hospitals', icon: 'Building2', tone: 'primary' },
    ],
  },
];

export const useAiAssistantStore = create<AiAssistantStore>((set) => ({
  messages: initialMessages,
  isOpen: false,
  isTyping: false,
  setOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setTyping: (isTyping) => set({ isTyping }),
  resetChat: () => set({ messages: initialMessages }),
}));

export default useAiAssistantStore;
