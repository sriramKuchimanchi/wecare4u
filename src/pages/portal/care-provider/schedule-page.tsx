import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useProviderRequestsQuery } from '@/hooks/use-portal-queries';
import { mockAppointments } from '@/utils/mock-data';
import { cn } from '@/lib/utils';

export const SchedulePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'week'>('today');

  const { data: requests = [] } = useProviderRequestsQuery();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Care Master Schedule</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Time-slotted calendar for scheduled visits, doctor appointments and emergency dispatches</p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center rounded-xl bg-muted p-1 border">
          {(['today', 'tomorrow', 'week'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                activeTab === tab ? 'bg-surface text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Calendar Grid */}
      <div className="space-y-4">
        {/* Time slots */}
        {[
          { time: '08:00 AM', title: 'Morning Care Shift Starts', type: 'system' },
          { time: '09:00 AM', title: 'Home Nursing Visit - Madhav Rao', patient: 'Madhav Rao', staff: 'Kavya Menon', category: 'Home Nurse Care', type: 'visit', reqId: 'req_101', priority: 'urgent' },
          { time: '10:30 AM', title: 'Doctor Home Consultation - Madhav Rao', patient: 'Madhav Rao', staff: 'Dr. Ananya Deshmukh', category: 'Doctor Visit', type: 'appointment', reqId: 'req_104' },
          { time: '01:00 PM', title: 'Emergency Caregiver Standby - Sultan Al-Mansoor', patient: 'Sultan Al-Mansoor', staff: 'Maria Santos', category: 'Caregiver', type: 'emergency', reqId: 'req_103' },
          { time: '03:30 PM', title: 'Arthritis Physiotherapy - Fatima Rahman', patient: 'Fatima Rahman', staff: 'Ahmed Khalil', category: 'Physiotherapy', type: 'visit', reqId: 'req_102' },
          { time: '06:00 PM', title: 'Evening Shift Handoff & Log Verification', type: 'system' },
        ].map((slot, i) => (
          <div
            key={i}
            className={cn(
              'rounded-2xl bg-surface p-4 border border-border/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all',
              slot.type === 'emergency' ? 'border-red-500/40 bg-red-500/5' : ''
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-24 shrink-0 flex items-center gap-1.5 font-bold text-xs text-primary">
                <icons.Clock className="h-4 w-4" /> {slot.time}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{slot.title}</h3>
                  {slot.priority === 'urgent' && (
                    <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                      URGENT
                    </span>
                  )}
                  {slot.type === 'emergency' && (
                    <span className="px-2 py-0.5 rounded-full text-2xs font-black bg-red-500/10 text-red-600 border border-red-500/30 animate-pulse">
                      EMERGENCY
                    </span>
                  )}
                </div>

                {slot.staff && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Staff: <span className="font-semibold text-foreground">{slot.staff}</span> • Category:{' '}
                    <span className="font-semibold text-foreground">{slot.category}</span>
                  </p>
                )}
              </div>
            </div>

            {slot.reqId && (
              <Button variant="outline" size="sm" onClick={() => navigate(`/portal/care-provider/bookings/${slot.reqId}`)}>
                <icons.Eye className="mr-1.5 h-3.5 w-3.5" /> View Visit
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
