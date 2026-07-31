import { useNavigate } from 'react-router-dom';
import { HandHeart, Siren, Phone, Building2, Search, Calendar, Pill } from '@/config/icons';
import type { SmartActionCard } from '@/types';
import { useCareRequestStore, useEmergencyStore } from '@/store';

type SmartActionCardsProps = {
  actions: SmartActionCard[];
  onActionClick?: () => void;
};

export const SmartActionCards = ({ actions, onActionClick }: SmartActionCardsProps) => {
  const navigate = useNavigate();
  const setConfirmationOpen = useEmergencyStore((s) => s.setConfirmationOpen);
  const setDraftCategory = useCareRequestStore((s) => s.setDraftCategory);

  const handleAction = (act: SmartActionCard) => {
    if (onActionClick) onActionClick();

    switch (act.actionType) {
      case 'request_care':
        if (act.payload?.category) {
          setDraftCategory(act.payload.category as string);
        }
        navigate('/portal/family/request-care');
        break;
      case 'emergency_sos':
        setConfirmationOpen(true);
        break;
      case 'call_emergency_contact':
        navigate('/portal/family/emergency-contacts');
        break;
      case 'view_nearby_hospitals':
        navigate('/portal/family/request-care?category=hospital');
        break;
      case 'view_care_providers':
        navigate('/portal/family/request-care');
        break;
      case 'schedule_appointment':
        navigate('/portal/family/appointments');
        break;
      case 'medication_reminder':
        navigate('/portal/family');
        break;
      default:
        navigate('/portal/family/request-care');
    }
  };

  const iconFor = (type: string) => {
    switch (type) {
      case 'emergency_sos': return Siren;
      case 'call_emergency_contact': return Phone;
      case 'view_nearby_hospitals': return Building2;
      case 'view_care_providers': return Search;
      case 'schedule_appointment': return Calendar;
      case 'medication_reminder': return Pill;
      default: return HandHeart;
    }
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((act) => {
        const Icon = iconFor(act.actionType);
        const isDanger = act.actionType === 'emergency_sos' || act.tone === 'danger';
        const isSecondary = act.tone === 'secondary';

        return (
          <button
            key={act.id}
            type="button"
            onClick={() => handleAction(act)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 ${
              isDanger
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : isSecondary
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SmartActionCards;
