import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Phone, Mail, MapPin, Heart, Shield, Calendar, Activity, FileText, Users,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState, StatusIndicator } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton, SkeletonText } from '@/components/shared/skeleton';
import {
  useFamilyMember, useTimeline, useAppointments, useCareRequests,
} from '@/hooks/use-family-portal';
import { formatDate, formatTime, formatRelative } from '@/utils/date';

export const FamilyMemberProfilePage = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { data: member, isLoading } = useFamilyMember(memberId ?? '');
  const { data: timeline = [] } = useTimeline();
  const { data: appointments = [] } = useAppointments();
  const { data: requests = [] } = useCareRequests();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32" />
        <SkeletonText lines={4} />
      </div>
    );
  }

  if (!member) {
    return (
      <Card>
        <EmptyState icon={Users} title="Member not found" description="This family member could not be found." action={<Button onClick={() => navigate('/portal/family/members')}>Back to members</Button>} />
      </Card>
    );
  }

  const age = member.dateOfBirth ? Math.floor((Date.now() - new Date(member.dateOfBirth).getTime()) / 365.25 / 86400000) : null;
  const memberTimeline = timeline.filter((t) => t.memberId === member.id).slice(0, 5);
  const memberAppointments = appointments.filter((a) => a.memberId === member.id).slice(0, 5);
  const memberRequests = requests.filter((r) => r.memberId === member.id).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </Button>

      {/* Header card */}
      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
        <Avatar className="h-20 w-20 border border-border">
          <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
            {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
            <StatusIndicator label={member.status === 'active' ? 'Active' : 'Inactive'} tone={member.status === 'active' ? 'success' : 'neutral'} />
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>{member.relationship}</span>
            {age && <span>· {age} years</span>}
            {member.bloodGroup && <Badge variant="outline" className="text-xs">{member.bloodGroup}</Badge>}
            {member.gender && <span>· {member.gender}</span>}
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/portal/family/members/${member.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit profile
        </Button>
      </Card>

      {/* Personal Information */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Personal Information" />
        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <InfoRow icon={Calendar} label="Date of birth" value={member.dateOfBirth ? formatDate(member.dateOfBirth, 'MMMM d, yyyy') : '—'} />
          <InfoRow icon={Heart} label="Blood group" value={member.bloodGroup ?? '—'} />
          <InfoRow icon={Shield} label="Government ID" value={member.governmentIdType ? `${member.governmentIdType.replace('-', ' ')} · ${member.governmentIdNumber ?? ''}` : '—'} />
          <InfoRow icon={Activity} label="Status" value={member.status === 'active' ? 'Active' : 'Inactive'} />
        </Card>
      </section>

      {/* Emergency Contacts */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Emergency Contacts" />
        {member.emergencyContacts && member.emergencyContacts.length > 0 ? (
          <div className="flex flex-col gap-2">
            {member.emergencyContacts.map((c, i) => (
              <Card key={i} className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <Phone className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-foreground">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.relationship} · {c.phone}</span>
                </div>
                {c.isPrimary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
              </Card>
            ))}
          </div>
        ) : (
          <Card><EmptyState icon={Phone} title="No emergency contacts" description="Add an emergency contact for this member." /></Card>
        )}
      </section>

      {/* Medical Summary */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Medical Summary" />
        <Card className="flex flex-col gap-4 p-5">
          {member.medicalConditions && member.medicalConditions.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Medical Conditions</span>
              <div className="flex flex-wrap gap-1.5">
                {member.medicalConditions.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
              </div>
            </div>
          )}
          {member.allergies && member.allergies.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Allergies</span>
              <div className="flex flex-wrap gap-1.5">
                {member.allergies.map((a) => <Badge key={a} variant="destructive" className="text-xs">{a}</Badge>)}
              </div>
            </div>
          )}
          {member.medicalNotes && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Medical Notes</span>
              <p className="text-sm text-foreground">{member.medicalNotes}</p>
            </div>
          )}
          {(!member.medicalConditions?.length && !member.allergies?.length && !member.medicalNotes) && (
            <p className="text-sm text-muted-foreground">No medical information recorded.</p>
          )}
        </Card>
      </section>

      {/* Insurance */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Insurance" />
        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <InfoRow icon={Shield} label="Provider" value={member.insurance?.provider ?? '—'} />
          <InfoRow icon={FileText} label="Policy number" value={member.insurance?.policyNumber ?? '—'} />
        </Card>
      </section>

      {/* Appointments Summary */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Appointments" />
        {memberAppointments.length > 0 ? (
          <div className="flex flex-col gap-2">
            {memberAppointments.map((apt) => (
              <Card key={apt.id} className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-foreground">{apt.serviceType}</span>
                  <span className="text-xs text-muted-foreground">{apt.providerName}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-foreground">{formatDate(apt.scheduledAt, 'MMM d')}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(apt.scheduledAt)}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card><EmptyState icon={Calendar} title="No appointments" description="This member has no scheduled appointments." /></Card>
        )}
      </section>

      {/* Timeline Summary */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Recent Activity" />
        {memberTimeline.length > 0 ? (
          <div className="flex flex-col gap-2">
            {memberTimeline.map((entry) => (
              <Card key={entry.id} className="flex items-start gap-3 p-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Activity className="h-4 w-4" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{entry.title}</span>
                  {entry.description && <span className="text-xs text-muted-foreground">{entry.description}</span>}
                  <span className="text-xs text-muted-foreground">{formatRelative(entry.createdAt)}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card><EmptyState icon={Activity} title="No activity" description="Care events for this member will appear here." /></Card>
        )}
      </section>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: typeof Heart; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <Icon className="h-4 w-4" />
    </span>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  </div>
);

export default FamilyMemberProfilePage;
