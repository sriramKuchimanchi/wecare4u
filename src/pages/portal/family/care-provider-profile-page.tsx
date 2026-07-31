import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Phone, Mail, Clock, BadgeCheck, Calendar, ArrowRight, Loader2, Users,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState, StatusIndicator } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton, SkeletonText } from '@/components/shared/skeleton';
import { useCareProvider, useSubmitCareRequestMutation, useFamilyMembers } from '@/hooks/use-family-portal';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatRelative } from '@/utils/date';
import { cn } from '@/lib/utils';

export const CareProviderProfilePage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { data: provider, isLoading } = useCareProvider(providerId ?? '');
  const { data: members = [] } = useFamilyMembers();
  const submitRequest = useSubmitCareRequestMutation();
  const { toast } = useToast();

  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-40" />
        <SkeletonText lines={5} />
      </div>
    );
  }

  if (!provider) {
    return (
      <Card>
        <EmptyState icon={Users} title="Provider not found" description="This care provider could not be found." action={<Button onClick={() => navigate('/portal/family/request-care')}>Back to categories</Button>} />
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: 'Select date & time', description: 'Please choose when you need care.', variant: 'destructive' });
      return;
    }
    const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();
    await submitRequest.mutateAsync({
      familyId: 'fam_1',
      memberId: selectedMember ?? undefined,
      providerId: provider.id,
      employeeId: selectedEmployee ?? undefined,
      category: provider.type,
      status: 'pending',
      scheduledAt,
      notes,
      estimatedCost: provider.startingPrice,
      currency: provider.currency,
    });
    navigate('/portal/family');
  };

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to providers
      </Button>

      {/* Header */}
      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-start">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Users className="h-8 w-8" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{provider.name}</h1>
            {provider.isVerified && (
              <Badge variant="secondary" className="gap-1">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </Badge>
            )}
          </div>
          {provider.rating && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-secondary fill-secondary" />
              <span className="font-medium text-foreground">{provider.rating}</span>
              ({provider.reviewCount ?? 0} reviews)
            </span>
          )}
          {provider.description && <p className="text-sm text-muted-foreground">{provider.description}</p>}
          <div className="flex flex-wrap gap-3 pt-1 text-xs text-muted-foreground">
            {provider.distanceKm != null && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {provider.distanceKm} km away</span>}
            {provider.experienceYears != null && <span>{provider.experienceYears} years experience</span>}
            {provider.startingPrice != null && <span>From {provider.currency} {provider.startingPrice}</span>}
            <StatusIndicator
              label={provider.availability === 'available' ? 'Available now' : provider.availability === 'busy' ? 'Currently busy' : 'Offline'}
              tone={provider.availability === 'available' ? 'success' : provider.availability === 'busy' ? 'warning' : 'neutral'}
            />
          </div>
        </div>
      </Card>

      {/* Contact & Location */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Contact & Location" />
        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {provider.contact.phone}</div>
          {provider.contact.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {provider.contact.email}</div>}
          <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /> {provider.address.line1}, {provider.address.city}</div>
          {provider.estimatedArrivalMinutes != null && <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-muted-foreground" /> ~{provider.estimatedArrivalMinutes} min arrival</div>}
        </Card>
      </section>

      {/* Services */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Services Offered" />
        <div className="flex flex-wrap gap-2">
          {provider.services.map((s) => <Badge key={s} variant="outline" className="text-sm">{s}</Badge>)}
        </div>
      </section>

      {/* Employees / Professionals */}
      {provider.employees && provider.employees.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Available Professionals" description="Choose who should provide care" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {provider.employees.map((emp) => {
              const active = selectedEmployee === emp.id;
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => setSelectedEmployee(active ? null : emp.id)}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all',
                    active ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary',
                  )}
                >
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {emp.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">{emp.name}</span>
                    <span className="text-xs text-muted-foreground">{emp.role} · {emp.experience}</span>
                    {emp.rating && <span className="text-xs text-muted-foreground">{emp.rating} ★</span>}
                    {emp.availability && <span className="mt-0.5 text-xs text-success">{emp.availability}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Request Care Form */}
      <section className="flex flex-col gap-4">
        <SectionHeader title="Request Care" description="Select date, time and add any notes" />
        <Card className="flex flex-col gap-4 p-5">
          {/* Family member */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">For whom?</label>
            <select
              value={selectedMember ?? ''}
              onChange={(e) => setSelectedMember(e.target.value || null)}
              className="h-10 rounded-md border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Myself / Family</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.relationship})</option>)}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-10 rounded-md border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="h-10 rounded-md border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Additional notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the care needed, symptoms, or any special instructions…"
              rows={3}
              className="rounded-md border border-input bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <Button onClick={handleSubmit} disabled={submitRequest.isPending} className="w-full">
            {submitRequest.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            Submit Care Request
          </Button>
        </Card>
      </section>

      {/* Reviews */}
      {provider.reviews && provider.reviews.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Reviews" description={`What families say about ${provider.name}`} />
          <div className="flex flex-col gap-2">
            {provider.reviews.map((review) => (
              <Card key={review.id} className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{review.reviewerName}</span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn('h-3.5 w-3.5', i < review.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground/30')} />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <span className="text-xs text-muted-foreground">{formatRelative(review.createdAt)}</span>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CareProviderProfilePage;
