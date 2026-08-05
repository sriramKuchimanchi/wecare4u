import type { ApiResult, AiChatMessage, SmartActionCard } from '@/types';
import { mockRequest, createId, nowISO } from '@/lib/mock-api';

export const aiAssistantService = {
  async processPrompt(prompt: string): Promise<ApiResult<AiChatMessage>> {
    const q = prompt.toLowerCase();
    let text = "I understand you need assistance. How can I help coordinate your care?";
    let actions: SmartActionCard[] = [];

    if (q.includes('chest pain') || q.includes('heart attack') || q.includes('stroke') || q.includes('unconscious') || q.includes('fall')) {
      text = "🚨 EMERGENCY DETECTED: Chest pain or severe distress requires immediate medical attention. I am ready to trigger Emergency SOS and notify nearest emergency responders and family contacts.";
      actions = [
        { id: 'act_sos_now', label: 'Trigger Emergency SOS', actionType: 'emergency_sos', icon: 'Siren', tone: 'danger' },
        { id: 'act_call_contact', label: 'Call Primary Contact', actionType: 'call_emergency_contact', icon: 'Phone', tone: 'secondary' },
        { id: 'act_hospitals', label: 'View Nearby Hospitals', actionType: 'view_nearby_hospitals', icon: 'Building2', tone: 'primary' },
      ];
    } else if (q.includes('doctor') || q.includes('physician') || q.includes('consultation')) {
      text = "I can help you request a doctor visit or clinic consultation for your family member. We have verified general practitioners and specialists available for home visits.";
      actions = [
        { id: 'act_doctor_req', label: 'Request Doctor Care', actionType: 'request_care', icon: 'Stethoscope', tone: 'primary', payload: { category: 'doctor' } },
        { id: 'act_browse_docs', label: 'View Doctors', actionType: 'view_care_providers', icon: 'Search', tone: 'secondary', payload: { category: 'doctor' } },
      ];
    } else if (q.includes('ambulance') || q.includes('transportation') || q.includes('hospital')) {
      text = "I can dispatch emergency medical transport or direct you to the nearest accredited hospital with senior care facilities.";
      actions = [
        { id: 'act_amb_req', label: 'Dispatch Ambulance', actionType: 'emergency_sos', icon: 'Ambulance', tone: 'danger' },
        { id: 'act_hosp_list', label: 'Find Nearby Hospitals', actionType: 'view_nearby_hospitals', icon: 'Building2', tone: 'primary' },
      ];
    } else if (q.includes('medicine') || q.includes('missed') || q.includes('prescription')) {
      text = "I've checked the medication schedule. Regular adherence is vital. Would you like me to log a medicine delivery request or remind your loved one now?";
      actions = [
        { id: 'act_med_rem', label: 'Check Medication Reminders', actionType: 'medication_reminder', icon: 'Pill', tone: 'primary' },
        { id: 'act_med_deliv', label: 'Order Medicine Delivery', actionType: 'request_care', icon: 'Pill', tone: 'secondary', payload: { category: 'medicine' } },
      ];
    } else if (q.includes('caregiver') || q.includes('nurse') || q.includes('assistance')) {
      text = "Our verified home nurses and caregivers offer compassionate daily living support, mobility assistance, and medical monitoring at home.";
      actions = [
        { id: 'act_nurse_req', label: 'Request Home Nurse', actionType: 'request_care', icon: 'HeartPulse', tone: 'primary', payload: { category: 'home-nurse' } },
        { id: 'act_caregiver_req', label: 'Request Caregiver', actionType: 'request_care', icon: 'Users', tone: 'secondary', payload: { category: 'caregiver' } },
      ];
    } else if (q.includes('electrician') || q.includes('plumber') || q.includes('housekeeping')) {
      text = "Home safety is essential for senior independence. I can schedule verified home maintenance professionals (Electricians, Plumbers, Housekeeping).";
      actions = [
        { id: 'act_elec', label: 'Request Electrician', actionType: 'request_care', icon: 'Zap', tone: 'primary', payload: { category: 'electrician' } },
        { id: 'act_plumb', label: 'Request Plumber', actionType: 'request_care', icon: 'Wrench', tone: 'secondary', payload: { category: 'plumber' } },
      ];
    } else {
      text = `I have received your request: "${prompt}". Let me guide you to the right care service or emergency action immediately.`;
      actions = [
        { id: 'act_gen_req', label: 'Request Service', actionType: 'request_care', icon: 'HandHeart', tone: 'primary' },
        { id: 'act_gen_sos', label: 'Emergency SOS', actionType: 'emergency_sos', icon: 'Siren', tone: 'danger' },
        { id: 'act_gen_providers', label: 'Explore All Providers', actionType: 'view_care_providers', icon: 'Search', tone: 'secondary' },
      ];
    }

    const message: AiChatMessage = {
      id: createId('msg'),
      sender: 'assistant',
      text,
      timestamp: nowISO(),
      actions,
    };

    return mockRequest(message, { latency: 600 });
  },
};

export default aiAssistantService;
