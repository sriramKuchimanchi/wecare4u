import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Building2, Users, HeartPulse, Pill, FlaskConical, Ambulance, Car, Zap, Wrench, Home, Activity, HandHeart,
  ArrowRight, ArrowLeft, Check, MapPin, Navigation, Pencil, Loader2, X,
} from '@/config/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCareCategories, mockCareProviders, mockFamilyMembers } from '@/utils/mock-data';
import { useNotificationStore, useTimelineStore, useLocationStore } from '@/store';
import careRequestService from '@/services/care-request.service';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import type { LucideIcon } from '@/config/icons';

const iconMap: Record<string, LucideIcon> = {
  Stethoscope, Building2, Users, HeartPulse, Pill, FlaskConical, Ambulance, Car, Zap, Wrench, Home, Activity, HandHeart,
};

type RequestCareWizardModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory?: string;
  initialProviderId?: string;
};

export const RequestCareWizardModal = ({
  open,
  onOpenChange,
  initialCategory,
  initialProviderId,
}: RequestCareWizardModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addTimelineEntry = useTimelineStore((s) => s.addEntry);
  const deviceLocation = useLocationStore((s) => s.location);
  const isLocating = useLocationStore((s) => s.isLoading);
  const refreshLocation = useLocationStore((s) => s.refresh);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  };

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'doctor');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(initialProviderId || null);
  const [locationMode, setLocationMode] = useState<'current' | 'manual'>('current');
  const [manualAddress, setManualAddress] = useState({ line1: '', city: '' });
  const [selectedMemberId, setSelectedMemberId] = useState<string>('mem_1');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('10:00');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialProviderId) setSelectedProviderId(initialProviderId);
  }, [initialCategory, initialProviderId]);

  const categoryObj = mockCareCategories.find((c) => c.id === selectedCategory) || mockCareCategories[0];
  const filteredProviders = mockCareProviders.filter(
    (p) => !selectedCategory || p.type === selectedCategory || p.services.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase()))
  );

  const providerObj = mockCareProviders.find((p) => p.id === selectedProviderId) || filteredProviders[0] || mockCareProviders[0];
  const selfMember = { id: 'self', name: user?.name ?? 'Myself', relationship: 'Myself' };
  const memberObj = selectedMemberId === 'self' ? selfMember : (mockFamilyMembers.find((m) => m.id === selectedMemberId) || mockFamilyMembers[0]);

  const resolvedAddress = locationMode === 'manual'
    ? { line1: manualAddress.line1 || 'Address not specified', city: manualAddress.city || '' }
    : { line1: deviceLocation?.address ?? 'Current location', city: deviceLocation?.city ?? '' };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    const now = new Date().toISOString();

    const res = await careRequestService.submit({
      familyId: 'fam_1',
      memberId: selectedMemberId,
      memberName: memberObj?.name,
      providerId: providerObj?.id,
      providerName: providerObj?.name,
      category: selectedCategory,
      categoryLabel: categoryObj.label,
      status: 'requested',
      scheduledAt,
      notes,
      address: {
        line1: resolvedAddress.line1,
        city: resolvedAddress.city,
        state: '',
        postalCode: '',
        country: 'India',
      },
      estimatedCost: providerObj?.startingPrice || 150,
      currency: providerObj?.currency || '₹',
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      addNotification({
        id: `notif_req_${Date.now()}`,
        userId: 'user_family_1',
        title: 'Care Request Submitted',
        message: `${categoryObj.label} request for ${memberObj?.name} has been sent to ${providerObj?.name}.`,
        read: false,
        type: 'success',
        createdAt: now,
        updatedAt: now,
      });

      addTimelineEntry({
        id: `tl_req_${Date.now()}`,
        familyId: 'fam_1',
        memberId: selectedMemberId,
        eventType: 'care-request-submitted',
        title: `Care Request Submitted (${categoryObj.label})`,
        description: `Requested from ${providerObj?.name} for ${memberObj?.name}. Notes: ${notes || 'None'}`,
        createdAt: now,
        updatedAt: now,
      });

      onOpenChange(false);
      setStep(1);
      navigate(`/portal/family/care-requests/${res.data.id}`);
    }
  };

  const stepTitles = [
    'Choose Category',
    'Choose Service Provider',
    'Pick Location',
    'Choose Date & Time',
    'Describe Requirement',
    'Review Summary',
    'Submit Request',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={scrollContainerRef} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-0 sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-primary p-4 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-2xs font-semibold uppercase tracking-wider text-secondary">Step {step} of 6</span>
              <DialogTitle className="text-lg font-bold text-white">{stepTitles[step - 1]}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={cn('h-1 flex-1 rounded-full transition-all', i + 1 <= step ? 'bg-secondary' : 'bg-white/20')}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="p-5">
          {/* STEP 1: Choose Category */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Select the type of care service your family needs:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {mockCareCategories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Stethoscope;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => { setSelectedCategory(cat.id); scrollToBottom(); }}
                      className={cn(
                        'flex w-[calc(50%-0.375rem)] flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all sm:w-[calc(33.333%-0.5rem)]',
                        isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary'
                      )}
                    >
                      <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{cat.label}</span>
                        <span className="text-2xs text-muted-foreground line-clamp-1">{cat.description}</span>
                        {cat.estimatedResponseTime && (
                          <span className="mt-1 text-2xs font-semibold text-secondary">~{cat.estimatedResponseTime}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Choose Service Provider */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Nearby verified providers for <strong>{categoryObj.label}</strong>:</p>
              {filteredProviders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No specific providers found for this category. Selecting best available provider.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredProviders.map((p) => {
                    const isSelected = selectedProviderId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProviderId(p.id)}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                          isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary'
                        )}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-foreground">{p.name}</span>
                            {p.rating && <Badge variant="secondary" className="text-xs">★ {p.rating} ({p.reviewCount})</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-2xs text-muted-foreground">
                            <span>{p.distanceKm} km away</span>
                            <span>· ~{p.estimatedArrivalMinutes} min arrival</span>
                            <span>· From {p.currency} {p.startingPrice}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Pick Location */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Where should the care professional visit?</p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => { setLocationMode('current'); if (!deviceLocation) refreshLocation(); }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                    locationMode === 'current' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary'
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Navigation className="h-5 w-5" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-bold text-foreground">Use my current location</span>
                    <span className="text-xs text-muted-foreground">
                      {isLocating ? 'Detecting…' : deviceLocation ? `${deviceLocation.address}, ${deviceLocation.city}` : 'Tap to detect automatically'}
                    </span>
                  </div>
                  {locationMode === 'current' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); refreshLocation(); }}
                      disabled={isLocating}
                      className="shrink-0"
                    >
                      {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Refresh'}
                    </Button>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setLocationMode('manual')}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                    locationMode === 'manual' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary'
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Pencil className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">Enter address manually</span>
                    <span className="text-xs text-muted-foreground">Useful when booking for a different address</span>
                  </div>
                </button>

                {locationMode === 'manual' && (
                  <div className="grid gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-medium">Address</label>
                      <input
                        type="text"
                        value={manualAddress.line1}
                        onChange={(e) => setManualAddress((a) => ({ ...a, line1: e.target.value }))}
                        placeholder="Flat / Street / Landmark"
                        className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">City</label>
                      <input
                        type="text"
                        value={manualAddress.city}
                        onChange={(e) => setManualAddress((a) => ({ ...a, city: e.target.value }))}
                        placeholder="City"
                        className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Choose Date & Time */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Select Family Member</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="self">{user?.name ?? 'Myself'} (Myself)</option>
                  {mockFamilyMembers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relationship})</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Preferred Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Describe Requirement */}
          {step === 5 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Provide details or special instructions for the service provider:</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe symptoms, medical history notes, entry instructions or specific preferences..."
                rows={5}
                className="w-full rounded-xl border border-input bg-surface p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* STEP 6: Review Summary */}
          {step === 6 && (
            <div className="flex flex-col gap-4">
              <Card className="flex flex-col gap-3 p-4 bg-muted/20 border-border">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Care Category</span>
                  <Badge variant="secondary" className="font-bold text-xs">{categoryObj.label}</Badge>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Service Provider</span>
                  <span className="text-sm font-bold text-foreground">{providerObj.name}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                    <MapPin className="h-3.5 w-3.5" /> Location
                  </span>
                  <span className="truncate text-sm font-bold text-foreground">{resolvedAddress.line1}{resolvedAddress.city ? `, ${resolvedAddress.city}` : ''}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Recipient Member</span>
                  <span className="text-sm font-bold text-foreground">{memberObj.name} ({memberObj.relationship})</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Date & Time</span>
                  <span className="text-sm font-bold text-foreground">{date} at {time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Estimated Cost</span>
                  <span className="text-base font-black text-primary">{providerObj.currency || '₹'} {providerObj.startingPrice || 1200}</span>
                </div>
              </Card>

              {notes && (
                <div className="rounded-xl border border-border p-3 bg-surface">
                  <span className="text-xs font-semibold text-muted-foreground">Notes:</span>
                  <p className="mt-1 text-xs text-foreground">{notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : <div />}

            {step < 6 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary text-primary-foreground font-bold">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Submit Care Request
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestCareWizardModal;
