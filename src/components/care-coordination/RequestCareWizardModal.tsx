import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Building2, Users, HeartPulse, Pill, FlaskConical, Ambulance, Car, Zap, Wrench, Home, Activity, HandHeart,
  ArrowRight, ArrowLeft, Check, Calendar, Clock, User, FileText, CheckCircle2, Loader2, Sparkles, X,
} from '@/config/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockCareCategories, mockCareProviders, mockFamilyMembers } from '@/utils/mock-data';
import { useCareRequestStore, useNotificationStore, useTimelineStore } from '@/store';
import careRequestService from '@/services/care-request.service';
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
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addTimelineEntry = useTimelineStore((s) => s.addEntry);

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'doctor');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(initialProviderId || null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
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
  const employeeObj = providerObj?.employees?.find((e) => e.id === selectedEmployeeId);
  const memberObj = mockFamilyMembers.find((m) => m.id === selectedMemberId) || mockFamilyMembers[0];

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
      employeeId: employeeObj?.id,
      employeeName: employeeObj?.name,
      employeeRole: employeeObj?.role,
      category: selectedCategory,
      categoryLabel: categoryObj.label,
      status: 'requested',
      scheduledAt,
      notes,
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
    'Choose Professional',
    'Choose Date & Time',
    'Describe Requirement',
    'Review Summary',
    'Submit Request',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-0 sm:rounded-2xl">
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
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {mockCareCategories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Stethoscope;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all',
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

          {/* STEP 3: Choose Professional */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Select a professional from <strong>{providerObj.name}</strong> (or auto-assign):</p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEmployeeId(null)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                    selectedEmployeeId === null ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary'
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary font-bold">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">Auto-assign Nearest Professional</span>
                    <span className="text-xs text-muted-foreground">Fastest dispatch response time (~15 mins)</span>
                  </div>
                </button>

                {providerObj.employees?.map((emp) => {
                  const isSelected = selectedEmployeeId === emp.id;
                  return (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => setSelectedEmployeeId(emp.id)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                        isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary'
                      )}
                    >
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                          {emp.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-bold text-foreground">{emp.name}</span>
                        <span className="text-xs text-muted-foreground">{emp.role} · {emp.experience}</span>
                      </div>
                      {emp.rating && <Badge variant="outline" className="text-xs">★ {emp.rating}</Badge>}
                    </button>
                  );
                })}
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
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Assigned Professional</span>
                  <span className="text-sm font-bold text-foreground">{employeeObj ? employeeObj.name : 'Auto-assign nearest'}</span>
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
