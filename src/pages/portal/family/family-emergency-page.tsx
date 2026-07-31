import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Siren, Phone, MapPin, CheckCircle2, AlertCircle, Play, ShieldAlert, Heart, Building2, UserCheck, ArrowRight, XCircle, RefreshCw,
} from '@/config/icons';
import { PageHeader, SectionHeader } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEmergencyStore, useEmergencyContactsStore, useNotificationStore, useTimelineStore } from '@/store';
import { LiveMapPlaceholder } from '@/components/care-coordination/LiveMapPlaceholder';
import EmergencyConfirmationSheet from '@/components/care-coordination/EmergencyConfirmationSheet';
import { cn } from '@/lib/utils';
import { formatRelative } from '@/utils/date';

export const FamilyEmergencyPage = () => {
  const navigate = useNavigate();
  const activeSession = useEmergencyStore((s) => s.activeSession);
  const advanceSessionStep = useEmergencyStore((s) => s.advanceSessionStep);
  const resolveSession = useEmergencyStore((s) => s.resolveActiveSession);
  const setConfirmationOpen = useEmergencyStore((s) => s.setConfirmationOpen);

  const contacts = useEmergencyContactsStore((s) => s.contacts);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addTimelineEntry = useTimelineStore((s) => s.addEntry);

  const handleResolve = () => {
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
          <div className="flex flex-col gap-3 rounded-2xl bg-destructive p-5 text-destructive-foreground shadow-elevated md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-white animate-pulse">
                <Siren className="h-8 w-8" />
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90">🚨 EMERGENCY ACTIVE</span>
                  <Badge variant="outline" className="text-2xs border-white/40 text-white">Live Tracking</Badge>
                </div>
                <h2 className="text-xl font-black text-white">{activeSession.memberName || 'Mohammed Rahman'}</h2>
                <p className="text-xs text-white/80">Location: {activeSession.location.line1}, {activeSession.location.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={advanceSessionStep}
                disabled={activeSession.currentStepIndex >= activeSession.steps.length - 1}
                className="bg-white text-destructive font-bold hover:bg-white/90"
              >
                <Play className="mr-1.5 h-4 w-4" /> Advance Stage
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResolve}
                className="border-white/40 text-white hover:bg-white/20 font-bold"
              >
                Resolve Emergency
              </Button>
            </div>
          </div>

          {/* Live Activity Map Tracking View */}
          <section className="flex flex-col gap-3">
            <SectionHeader title="Live Responder Location & ETA" description="GPS tracking of assigned ambulance & responders" />
            <LiveMapPlaceholder
              title="Ambulance & Responders En Route"
              subtitle="Rapid Response AMB-9912"
              isEmergency
              etaMinutes={activeSession.assignedAmbulance?.etaMinutes || 6}
              providerName={activeSession.assignedProvider?.name || 'Sunrise Response'}
            />
          </section>

          {/* Emergency Responders & Hospital Details */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Assigned Provider */}
            <Card className="flex flex-col gap-3 p-4 border-border bg-card">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-2xs font-semibold uppercase text-muted-foreground">Assigned Provider</span>
                  <span className="text-sm font-bold text-foreground">{activeSession.assignedProvider?.name}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => window.location.href = `tel:${activeSession.assignedProvider?.phone}`}>
                <Phone className="h-4 w-4 text-primary" /> Call Provider
              </Button>
            </Card>

            {/* Assigned Professional */}
            <Card className="flex flex-col gap-3 p-4 border-border bg-card">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <UserCheck className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-2xs font-semibold uppercase text-muted-foreground">Lead Responder</span>
                  <span className="text-sm font-bold text-foreground">{activeSession.assignedProfessional?.name}</span>
                  <span className="text-2xs text-muted-foreground">{activeSession.assignedProfessional?.role}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => window.location.href = `tel:${activeSession.assignedProfessional?.phone}`}>
                <Phone className="h-4 w-4 text-primary" /> Call Responder
              </Button>
            </Card>

            {/* Notified Hospital */}
            <Card className="flex flex-col gap-3 p-4 border-border bg-card">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <Heart className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-2xs font-semibold uppercase text-muted-foreground">Notified Hospital</span>
                  <span className="text-sm font-bold text-foreground">{activeSession.notifiedHospital?.name}</span>
                  <span className="text-2xs text-muted-foreground">Medical Records Sent</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => window.location.href = `tel:${activeSession.notifiedHospital?.phone}`}>
                <Phone className="h-4 w-4 text-primary" /> Call ER Desk
              </Button>
            </Card>
          </div>

          {/* Emergency Flow Workflow Tracker (All 10 Stages) */}
          <section className="flex flex-col gap-3">
            <SectionHeader title="Emergency Response Workflow" description="Real-time status of emergency stages" />
            <Card className="p-5">
              <div className="flex flex-col space-y-4">
                {activeSession.steps.map((st, idx) => {
                  const isDone = st.status === 'completed';
                  const isCurrent = st.status === 'in-progress';

                  return (
                    <div key={st.step} className="flex items-start gap-3">
                      <span
                        className={cn(
                          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all',
                          isDone && 'bg-success/15 text-success',
                          isCurrent && 'bg-secondary text-secondary-foreground ring-4 ring-secondary/20 animate-pulse',
                          !isDone && !isCurrent && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </span>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center justify-between">
                          <span className={cn('text-sm font-bold', isCurrent ? 'text-secondary' : isDone ? 'text-foreground' : 'text-muted-foreground')}>
                            {st.title}
                          </span>
                          {st.completedAt && <span className="text-2xs text-muted-foreground">{formatRelative(st.completedAt)}</span>}
                        </div>
                        <span className="text-xs text-muted-foreground">{st.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        </div>
      )}

      {/* Confirmation Sheet */}
      <EmergencyConfirmationSheet />
    </div>
  );
};

export default FamilyEmergencyPage;
