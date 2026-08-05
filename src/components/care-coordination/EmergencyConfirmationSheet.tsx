import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Siren, ArrowLeft, User, Users, Mic, Square } from '@/config/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEmergencyStore, useNotificationStore, useTimelineStore, useLocationStore } from '@/store';
import { useAuth } from '@/hooks/use-auth';
import { useFamilyMembers } from '@/hooks/use-family-portal';
import { cn } from '@/lib/utils';

type Target = { memberId?: string; memberName: string };

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

const getSpeechRecognition = (): (new () => SpeechRecognitionLike) | null => {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export const EmergencyConfirmationSheet = () => {
  const isOpen = useEmergencyStore((s) => s.isConfirmationOpen);
  const setOpen = useEmergencyStore((s) => s.setConfirmationOpen);
  const setActiveSession = useEmergencyStore((s) => s.setActiveSession);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addTimelineEntry = useTimelineStore((s) => s.addEntry);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: familyMembers = [] } = useFamilyMembers();
  const knownLocation = useLocationStore((s) => s.location);

  const [step, setStep] = useState<'target' | 'confirm'>('target');
  const [target, setTarget] = useState<Target | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechSupported = Boolean(getSpeechRecognition());

  // Reset the flow back to the start each time the sheet is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setStep('target');
      setTarget(null);
      setConfirmed(false);
      setNote('');
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  }, [isOpen]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const handleSelectTarget = (next: Target) => {
    setTarget(next);
    setStep('confirm');
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    const baseNote = note.trim();
    let finalTranscript = '';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += `${transcript} `;
        else interim += transcript;
      }
      const spoken = (finalTranscript + interim).trim();
      setNote(spoken ? [baseNote, spoken].filter(Boolean).join(' ') : baseNote);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleTriggerEmergency = () => {
    if (!target) return;
    const now = new Date().toISOString();
    const newSession = {
      id: `emg_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      familyId: 'fam_1',
      memberId: target.memberId,
      memberName: target.memberName,
      status: 'active' as const,
      currentStepIndex: 1,
      notifiedContactsCount: 3,
      location: !target.memberId && knownLocation
        ? {
            line1: knownLocation.address,
            city: knownLocation.city,
            state: '',
            country: 'India',
            postalCode: '',
            lat: knownLocation.lat,
            lng: knownLocation.lng,
          }
        : {
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
        name: 'Kavya Menon',
        role: 'Senior Emergency Caregiver',
        phone: '+971 50 555 1212',
      },
      assignedAmbulance: {
        vehicleNumber: 'AMB-9912',
        driverName: 'Raghav Mehta',
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
        { step: 'provider_found' as const, title: 'Nearest Service Provider Found', description: 'Sunrise Emergency Healthcare (2.4 km away)', status: 'pending' as const },
        { step: 'professional_assigned' as const, title: 'Nearest Professional Assigned', description: 'Kavya Menon (Senior Caregiver)', status: 'pending' as const },
        { step: 'ambulance_assigned' as const, title: 'Ambulance Assigned & Dispatched', description: 'AMB-9912 en route to location', status: 'pending' as const },
        { step: 'hospital_notified' as const, title: 'Hospital & Doctor Notified', description: 'Patient records shared with Dubai Healthcare City Hospital', status: 'pending' as const },
        { step: 'contacts_notified' as const, title: 'Emergency Contacts Notified', description: 'SMS + Push notification sent to 3 contacts', status: 'pending' as const },
        { step: 'live_updates' as const, title: 'Live Status & Location Active', description: 'Real-time GPS tracking stream', status: 'pending' as const },
        { step: 'resolved' as const, title: 'Emergency Resolved', description: 'Responders arrived on site', status: 'pending' as const },
      ],
    };

    setActiveSession(newSession);
    setOpen(false);

    const trimmedNote = note.trim();

    // Notify user & add to timeline
    addNotification({
      id: `notif_sos_${Date.now()}`,
      userId: 'user_family_1',
      title: '🚨 Emergency SOS Triggered',
      message: `AI Care Coordinator activated for ${target.memberName}. Ambulance and responders dispatched.${trimmedNote ? ` Note: "${trimmedNote}"` : ''}`,
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
      description: trimmedNote
        ? `Emergency response activated for ${target.memberName} at Marina Heights. Note: "${trimmedNote}"`
        : `Emergency response activated for ${target.memberName} at Marina Heights.`,
      createdAt: now,
      updatedAt: now,
    });

    navigate('/portal/family/emergency');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="mx-auto max-h-[90vh] max-w-lg overflow-y-auto rounded-t-2xl p-6">
        {step === 'target' ? (
          <>
            <SheetHeader className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
                <Siren className="h-8 w-8 animate-pulse" />
              </div>
              <SheetTitle className="mt-3 text-xl font-bold text-foreground">Who needs help?</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Tell us who this emergency is for so we can dispatch the right care and share the correct medical history.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSelectTarget({ memberName: user?.name ?? 'Myself' })}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-destructive hover:shadow-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <User className="h-5 w-5" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                  <span className="truncate text-sm font-semibold leading-tight text-foreground">Myself</span>
                  <span className="truncate text-xs leading-tight text-muted-foreground">{user?.name ?? 'This is for me'}</span>
                </div>
              </button>

              {familyMembers.length > 0 && (
                <>
                  <p className="mt-2 flex items-center gap-1.5 px-4 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> A family member
                  </p>
                  {familyMembers.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectTarget({ memberId: m.id, memberName: m.name })}
                      className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-destructive hover:shadow-soft"
                    >
                      <Avatar className="h-11 w-11 shrink-0">
                        <AvatarImage src={m.avatarUrl} alt={m.name} />
                        <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        <span className="truncate text-sm font-semibold leading-tight text-foreground">{m.name}</span>
                        <span className="truncate text-xs leading-tight text-muted-foreground">{m.relationship}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}

              <div className="mt-3 flex flex-col gap-1.5">
                <label htmlFor="sos-note" className="px-1 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Anything responders should know? (optional)
                </label>
                <div className="relative">
                  <Textarea
                    id="sos-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={speechSupported ? "Type or tap the mic to speak — e.g. 'chest pain, difficulty breathing'" : "e.g. 'chest pain, difficulty breathing'"}
                    rows={2}
                    className="min-h-[64px] resize-none rounded-xl bg-surface pr-12 text-sm"
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                      aria-pressed={isListening}
                      className={cn(
                        'absolute right-2 top-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                        isListening
                          ? 'bg-destructive text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                      )}
                    >
                      {isListening ? <Square className="h-3.5 w-3.5 fill-current" /> : <Mic className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {isListening && (
                  <span className="flex items-center gap-1.5 px-1 text-2xs font-medium text-destructive">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" /> Listening…
                  </span>
                )}
              </div>

              <Button variant="outline" size="lg" onClick={() => setOpen(false)} className="mt-2 w-full">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <SheetHeader className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
                <Siren className="h-8 w-8 animate-pulse" />
              </div>
              <SheetTitle className="mt-3 text-xl font-bold text-foreground">Trigger Emergency SOS for {target?.memberName}?</SheetTitle>
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
                <Button variant="outline" size="lg" onClick={() => setStep('target')} className="w-full">
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EmergencyConfirmationSheet;
