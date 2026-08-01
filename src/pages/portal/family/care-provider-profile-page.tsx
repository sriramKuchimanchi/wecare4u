import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Phone, Mail, Clock, BadgeCheck, Users, Shield, Globe, Image as ImageIcon, Siren,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton, SkeletonText } from '@/components/shared/skeleton';
import { useCareProvider } from '@/hooks/use-family-portal';
import { RequestCareWizardModal } from '@/components/care-coordination/RequestCareWizardModal';
import { formatRelative } from '@/utils/date';
import { cn } from '@/lib/utils';


export const CareProviderProfilePage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { data: provider, isLoading } = useCareProvider(providerId ?? '');

  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

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
        <EmptyState
          icon={Users}
          title="Provider not found"
          description="This service provider could not be found."
          action={<Button onClick={() => navigate('/portal/family/request-care')}>Back to Request Care</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Service Providers
      </Button>

      {/* Hero Header */}
      <Card className="flex flex-col gap-5 p-6 md:flex-row md:items-start bg-card border-border shadow-sm">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-2xl">
          {provider.name.charAt(0)}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{provider.name}</h1>
            {provider.isVerified && (
              <Badge variant="secondary" className="gap-1 bg-secondary/15 text-secondary-foreground font-bold">
                <BadgeCheck className="h-4 w-4" /> Verified Partner
              </Badge>
            )}
            {provider.emergencyAvailable !== false && (
              <Badge variant="destructive" className="gap-1">
                <Siren className="h-3.5 w-3.5" /> 24×7 Emergency Ready
              </Badge>
            )}
          </div>

          {provider.rating && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span>{provider.rating}</span>
              <span className="text-muted-foreground">({provider.reviewCount ?? 0} reviews)</span>
            </span>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">{provider.description}</p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground border-t border-border mt-2">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {provider.distanceKm ?? 2.4} km away</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-secondary" /> ~{provider.estimatedArrivalMinutes ?? 20} min arrival</span>
            <span>{provider.experienceYears ?? 10} years experience</span>
            <span className="font-bold text-primary">From {provider.currency ?? '₹'} {provider.startingPrice ?? 1200}</span>
          </div>
        </div>

        <Button onClick={() => setWizardOpen(true)} size="lg" className="bg-primary text-primary-foreground font-bold shrink-0 shadow-md">
          Request Care Now
        </Button>
      </Card>

      {/* Organization Overview & Key Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col gap-4 p-5">
          <SectionHeader title="Organization Overview" />
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{provider.contact.phone}</span>
            </div>
            {provider.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{provider.contact.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{provider.address.line1}, {provider.address.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Business Hours: {provider.businessHours || '24/7 Care Operations'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Languages Spoken: {provider.languagesSpoken?.join(', ') || 'English, Arabic, Hindi, Tagalog'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Coverage Area: {provider.coverageArea || 'Greater Dubai & Abu Dhabi Metro Areas'}</span>
            </div>
          </div>
        </Card>

        {/* Gallery / Photos Placeholder */}
        <Card className="flex flex-col gap-4 p-5">
          <SectionHeader title="Facility & Care Gallery" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="flex h-20 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border">
                <ImageIcon className="h-6 w-6 opacity-40" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Services Offered */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Services Offered" description="Comprehensive care solutions provided" />
        <div className="flex flex-wrap gap-2">
          {provider.services.map((s) => (
            <Badge key={s} variant="outline" className="px-3 py-1 text-sm bg-surface">
              ✓ {s}
            </Badge>
          ))}
        </div>
      </section>

      {/* Available Professionals */}
      {provider.employees && provider.employees.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Available Professionals" description="Choose who should provide care for your family" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {provider.employees.map((emp) => {
              const isSelected = selectedEmployee === emp.id;
              return (
                <Card
                  key={emp.id}
                  className={cn('flex items-start gap-3 p-4 cursor-pointer transition-all', isSelected && 'border-primary ring-2 ring-primary/20')}
                  onClick={() => setSelectedEmployee(isSelected ? null : emp.id)}
                >
                  <Avatar className="h-12 w-12 border border-border">
                    {emp.avatarUrl && <AvatarImage src={emp.avatarUrl} alt={emp.name} />}
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {emp.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-bold text-foreground">{emp.name}</span>
                    <span className="text-xs text-muted-foreground">{emp.role} · {emp.experience}</span>
                    {emp.rating && <span className="text-xs font-medium text-secondary">★ {emp.rating}</span>}
                    {emp.availability && <span className="mt-1 text-2xs font-semibold text-success">{emp.availability}</span>}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Ratings & Reviews */}
      {provider.reviews && provider.reviews.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Ratings & Reviews" description={`What families say about ${provider.name}`} />
          <div className="flex flex-col gap-3">
            {provider.reviews.map((review) => (
              <Card key={review.id} className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{review.reviewerName}</span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn('h-3.5 w-3.5', i < review.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground/30')}
                      />
                    ))}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                <span className="text-2xs text-muted-foreground">{formatRelative(review.createdAt)}</span>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 7-Step Request Care Wizard Modal */}
      <RequestCareWizardModal
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        initialCategory={provider.type === 'home-care' ? 'caregiver' : provider.type}
        initialProviderId={provider.id}
      />
    </div>
  );
};

export default CareProviderProfilePage;
