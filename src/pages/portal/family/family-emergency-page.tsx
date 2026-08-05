import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Siren, Phone, ShieldAlert, Heart, Building2, UserCheck,
} from '@/config/icons';
import { PageHeader, SectionHeader } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEmergencyStore, useEmergencyContactsStore, useNotificationStore, useTimelineStore } from '@/store';
import { LiveMapPlaceholder } from '@/components/care-coordination/LiveMapPlaceholder';
import { ProgressTracker } from '@/components/care-coordination/ProgressTracker';
import { formatRelative } from '@/utils/date';

const AUTO_ADVANCE_MS = 4500;

export const FamilyEmergencyPage = () => {
  const navigate = useNavigate();
  const activeSession = useEmergencyStore((s) => s.activeSession);
  const advanceSessionStep = useEmergencyStore((s) => s.advanceSessionStep);
  const resolveSession = useEmergencyStore((s) => s.resolveActiveSession);
  const cancelSession = useEmergencyStore((s) => s.cancelActiveSession);
  const setConfirmationOpen = useEmergencyStore((s) => s.setConfirmationOpen);

  const contacts = useEmergencyContactsStore((s) => s.contacts);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addTimelineEntry = useTimelineStore((s) => s.addEntry);

  // The response workflow is driven by the assigned provider/dispatch system, not the
  // family — this simulates those live updates arriving automatically over time.
  useEffect(() => {
    if (!activeSession) return;
    const isAtFinalStep = activeSession.currentStepIndex >= activeSession.steps.length - 1;

    if (isAtFinalStep) {
      const timeout = setTimeout(() => {
        const now = new Date().toISOString();
        resolveSession();
        addNotification({
          id: `notif_emg_res_${Date.now()}`,
          userId: 'user_family_1',
          title: '✅ Emergency Resolved',
          message: 'Responders arrived on scene and patient is in safe care.',
          read: false,
          type: 'success',
          createdAt: now,
          updatedAt: now,
        });
        addTimelineEntry({
          id: `tl_emg_res_${Date.now()}`,
          familyId: 'fam_1',
          eventType: 'emergency-resolved',
          title: 'Emergency SOS Resolved',
          description: 'Patient stabilized and emergency responders resolved the case.',
          createdAt: now,
          updatedAt: now,
        });
      }, AUTO_ADVANCE_MS);
      return () => clearTimeout(timeout);
    }

    const interval = setTimeout(() => advanceSessionStep(), AUTO_ADVANCE_MS);
    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.currentStepIndex, activeSession?.id]);

  const handleStandDown = () => {
    const now = new Date().toISOString();
    cancelSession();

    addNotification({
      id: `notif_emg_standdown_${Date.now()}`,
      userId: 'user_family_1',
      title: 'Emergency SOS Cancelled',
      message: 'You marked yourself safe and stood down the emergency response.',
      read: false,
      type: 'info',
      createdAt: now,
      updatedAt: now,
    });

    addTimelineEntry({
      id: `tl_emg_standdown_${Date.now()}`,
      familyId: 'fam_1',
      eventType: 'emergency-resolved',
      title: 'Emergency SOS Cancelled by Family',
      description: 'Family reported the situation as safe and stood down the response.',
      createdAt: now,
      updatedAt: now,
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Emergency SOS & Live Coordination"
        description="Immediate emergency dispatch, AI coordination, ambulance tracking, and hospital alerts"
      />

      {!activeSession ? (
        /* INACTIVE EMERGENCY STATE - Big Trigger SOS Card */
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col items-center justify-center p-8 text-center border-destructive/20 bg-destructive/[0.02]">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-elevated">
              <span className="absolute -inset-3 animate-ping rounded-full bg-destructive/20" />
              <Siren className="h-14 w-14" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-foreground md:text-3xl">Emergency SOS</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              One tap dispatches nearby ambulances, alerts linked hospitals with patient history, assigns emergency caregivers, and notifies your family contacts.
            </p>

            <Button
              variant="destructive"
              size="lg"
              onClick={() => setConfirmationOpen(true)}
              className="mt-6 h-14 px-8 text-lg font-bold shadow-lg"
            >
              <Siren className="mr-2 h-6 w-6" /> PRESS SOS EMERGENCY
            </Button>
          </Card>

          {/* Quick Contacts Bar */}
          <section className="flex flex-col gap-3">
            <SectionHeader
              title="Family Emergency Contacts"
              description="Contacts alerted automatically during emergencies"
              actions={
                <Button variant="outline" size="sm" onClick={() => navigate('/portal/family/emergency-contacts')}>
                  Manage Contacts
                </Button>
              }
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {contacts.map((c) => (
                <Card key={c.id || c.name} className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {c.name.charAt(0)}
                  </span>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">{c.name}</span>
                      {c.isPrimary && <Badge variant="secondary" className="text-2xs">Primary</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{c.relationship} · {c.phone}</span>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => window.location.href = `tel:${c.phone}`}>
                    <Phone className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ACTIVE EMERGENCY WORKFLOW & LIVE TRACKING SCREEN */
        <div className="flex flex-col gap-6">
          {/* Active Emergency Banner */}
          <div className="flex flex-col gap-3 rounded-2xl border border-destructive/20 bg-destructive/[0.04] p-5 md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Siren className="h-7 w-7 animate-pulse" />
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-destructive">Emergency Active</span>
                  <Badge variant="outline" className="text-2xs border-destructive/30 text-destructive">Live Tracking</Badge>
                </div>
                <h2 className="text-xl font-black text-foreground">{activeSession.memberName || 'Madhav Rao'}</h2>
                <p className="text-xs text-muted-foreground">Location: {activeSession.location.line1}, {activeSession.location.city}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleStandDown}
              className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 font-bold"
            >
              <ShieldAlert className="mr-1.5 h-4 w-4" /> I'm Safe — Stand Down
            </Button>
          </div>

          {/* Live Tracking: Map & Response Workflow side by side */}
          <section className="flex flex-col gap-3">
            <SectionHeader title="Live Tracking & Response Progress" description="Responder location and real-time dispatch status, at a glance" />
            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              <div className="flex flex-col gap-5">
                <LiveMapPlaceholder
                  title="Ambulance & Responders En Route"
                  subtitle="Rapid Response AMB-9912"
                  isEmergency
                  etaMinutes={activeSession.assignedAmbulance?.etaMinutes || 6}
                  providerName={activeSession.assignedProvider?.name || 'Sunrise Response'}
                  lat={activeSession.location?.lat}
                  lng={activeSession.location?.lng}
                />

                {/* Assigned Provider, Responder & Hospital — fills the remaining space under the
                    square map so this column's bottom edge lines up with the tracker card. */}
                <Card className="flex flex-1 flex-col divide-y divide-border p-0">
                  <div className="flex items-center gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="text-2xs font-semibold uppercase text-muted-foreground">Assigned Provider</span>
                      <span className="text-sm font-bold text-foreground">{activeSession.assignedProvider?.name}</span>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={() => window.location.href = `tel:${activeSession.assignedProvider?.phone}`}>
                      <Phone className="h-4 w-4 text-primary" /> Call
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <UserCheck className="h-5 w-5" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="text-2xs font-semibold uppercase text-muted-foreground">Lead Responder</span>
                      <span className="text-sm font-bold text-foreground">{activeSession.assignedProfessional?.name}</span>
                      <span className="text-2xs text-muted-foreground">{activeSession.assignedProfessional?.role}</span>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={() => window.location.href = `tel:${activeSession.assignedProfessional?.phone}`}>
                      <Phone className="h-4 w-4 text-primary" /> Call
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                      <Heart className="h-5 w-5" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="text-2xs font-semibold uppercase text-muted-foreground">Notified Hospital</span>
                      <span className="text-sm font-bold text-foreground">{activeSession.notifiedHospital?.name}</span>
                      <span className="text-2xs text-muted-foreground">Medical Records Sent</span>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={() => window.location.href = `tel:${activeSession.notifiedHospital?.phone}`}>
                      <Phone className="h-4 w-4 text-primary" /> Call
                    </Button>
                  </div>
                </Card>
              </div>

              <Card className="flex flex-col p-5">
                <h3 className="mb-4 text-sm font-bold text-foreground">Emergency Response Workflow</h3>
                <ProgressTracker
                  currentIndex={activeSession.currentStepIndex}
                  steps={activeSession.steps.map((st) => ({
                    key: st.step,
                    label: st.title,
                    description: st.description,
                    timestamp: st.completedAt ? formatRelative(st.completedAt) : undefined,
                  }))}
                />
              </Card>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default FamilyEmergencyPage;
