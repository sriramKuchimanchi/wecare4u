import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Siren, ShieldAlert, CheckCircle2 } from '@/config/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useEmergencyStore, useNotificationStore, useTimelineStore } from '@/store';

export const EmergencyConfirmationSheet = () => {
  const isOpen = useEmergencyStore((s) => s.isConfirmationOpen);
  const setOpen = useEmergencyStore((s) => s.setConfirmationOpen);
  const setActiveSession = useEmergencyStore((s) => s.setActiveSession);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addTimelineEntry = useTimelineStore((s) => s.addEntry);
  const navigate = useNavigate();

  const [confirmed, setConfirmed] = useState(false);

  const handleTriggerEmergency = () => {
    const now = new Date().toISOString();
    const newSession = {
      id: `emg_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      familyId: 'fam_1',
      memberName: 'Mohammed Rahman',
      status: 'active' as const,
      currentStepIndex: 1,
      notifiedContactsCount: 3,
      location: {
        line1: 'Marina Heights, Apt 1203',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
        postalCode: '00000',
        lat: 25.0772,
        lng: 55.1332,
      },
      assignedProvider: {
        id: 'prov_1',
        name: 'Sunrise Emergency Healthcare',
        phone: '+971 4 333 1111',
        etaMinutes: 10,
      },
      assignedProfessional: {
        id: 'emp_1',
        name: 'Layla Al-Nasser',
        role: 'Senior Emergency Caregiver',
        phone: '+971 50 555 1212',
      },
      assignedAmbulance: {
        vehicleNumber: 'AMB-9912',
        driverName: 'Rashid Khan',
        phone: '+971 50 888 9999',
        etaMinutes: 6,
      },
      notifiedHospital: {
        name: 'Dubai Healthcare City Hospital',
        phone: '+971 4 222 3333',
        address: 'Building 64, Healthcare City, Dubai',
      },
      steps: [
        { step: 'sos_triggered' as const, title: 'Emergency SOS Triggered', description: 'Emergency signal activated', status: 'completed' as const, completedAt: now },
        { step: 'location_detected' as const, title: 'Location Detected', description: 'Marina Heights, Apt 1203, Dubai (25.0772° N, 55.1332° E)', status: 'completed' as const, completedAt: now },
        { step: 'coordinator_activated' as const, title: 'AI Care Coordinator Activated', description: 'Assessing medical emergency priority', status: 'in-progress' as const },
        { step: 'provider_found' as const, title: 'Nearest Care Provider Found', description: 'Sunrise Emergency Healthcare (2.4 km away)', status: 'pending' as const },
        { step: 'professional_assigned' as const, title: 'Nearest Professional Assigned', description: 'Layla Al-Nasser (Senior Caregiver)', status: 'pending' as const },
        { step: 'ambulance_assigned' as const, title: 'Ambulance Assigned & Dispatched', description: 'AMB-9912 en route to location', status: 'pending' as const },
        { step: 'hospital_notified' as const, title: 'Hospital & Doctor Notified', description: 'Patient records shared with Dubai Healthcare City Hospital', status: 'pending' as const },
        { step: 'contacts_notified' as const, title: 'Emergency Contacts Notified', description: 'SMS + Push notification sent to 3 contacts', status: 'pending' as const },
        { step: 'live_updates' as const, title: 'Live Status & Location Active', description: 'Real-time GPS tracking stream', status: 'pending' as const },
        { step: 'resolved' as const, title: 'Emergency Resolved', description: 'Responders arrived on site', status: 'pending' as const },
      ],
    };

    setActiveSession(newSession);
    setOpen(false);
    setConfirmed(false);

    // Notify user & add to timeline
    addNotification({
      id: `notif_sos_${Date.now()}`,
      userId: 'user_family_1',
      title: '🚨 Emergency SOS Triggered',
      message: 'AI Care Coordinator activated. Ambulance and responders dispatched.',
      read: false,
      type: 'error',
      createdAt: now,
      updatedAt: now,
    });

    addTimelineEntry({
      id: `tl_sos_${Date.now()}`,
      familyId: 'fam_1',
      eventType: 'emergency-triggered',
      title: 'Emergency SOS Triggered',
      description: 'Emergency response activated for Mohammed Rahman at Marina Heights.',
      createdAt: now,
      updatedAt: now,
    });

    navigate('/portal/family/emergency');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="mx-auto max-w-lg rounded-t-2xl p-6">
        <SheetHeader className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
            <Siren className="h-8 w-8 animate-pulse" />
          </div>
          <SheetTitle className="mt-3 text-xl font-bold text-foreground">Trigger Emergency SOS?</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            This will immediately dispatch nearby emergency responders, alert your family doctor, and notify all listed emergency contacts.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.03] p-4">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-destructive text-destructive focus:ring-destructive"
            />
            <span className="text-xs font-medium text-foreground">
              "I understand this is for emergencies."
            </span>
          </label>

          <div className="flex flex-col gap-2">
            <Button
              variant="destructive"
              size="lg"
              disabled={!confirmed}
              onClick={handleTriggerEmergency}
              className="w-full text-base font-bold shadow-md"
            >
              <Siren className="mr-2 h-5 w-5" /> CONFIRM & DISPATCH EMERGENCY
            </Button>
            <Button variant="outline" size="lg" onClick={() => setOpen(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EmergencyConfirmationSheet;
