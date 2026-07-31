import { useNavigate } from 'react-router-dom';
import {
  User, Users, Shield, MapPin, Bell, Globe, Lock, LogOut, Pencil, ChevronRight, Phone, Mail,
} from '@/config/icons';
import { PageHeader, SectionHeader } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useLogoutMutation } from '@/hooks/use-auth-mutations';
import { useMyFamily } from '@/hooks/use-family-portal';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { LucideIcon } from '@/config/icons';

const ToggleRow = ({ label, description, defaultOn }: { label: string; description: string; defaultOn?: boolean }) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <Toggle defaultOn={defaultOn} />
    </div>
  );
};

const Toggle = ({ defaultOn }: { defaultOn?: boolean }) => {
  return (
    <button
      type="button"
      className={cn('relative h-6 w-11 rounded-full transition-colors', defaultOn ? 'bg-primary' : 'bg-muted')}
      aria-pressed={defaultOn}
    >
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform', defaultOn ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
};

const SettingRow = ({ icon: Icon, label, value, onClick }: { icon: LucideIcon; label: string; value?: string; onClick?: () => void }) => (
  <button type="button" onClick={onClick} className="flex w-full items-center gap-3 py-3 text-left">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <Icon className="h-4 w-4" />
    </span>
    <div className="flex flex-1 flex-col">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </button>
);

export const FamilyProfilePage = () => {
  const { user } = useAuth();
  const { data: family } = useMyFamily();
  const logout = useLogoutMutation();
  const navigate = useNavigate();

  const initials = (user?.name ?? '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const handleLogout = () => {
    logout.mutate();
    navigate(ROUTES.landing);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile" description="Manage your family account and preferences" />

      {/* Account header */}
      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
        <Avatar className="h-20 w-20 border border-border">
          <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <h2 className="text-xl font-bold text-foreground">{user?.name ?? 'Family Account'}</h2>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user?.email}</span>
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {user?.phone}</span>
          </div>
          {family && <Badge variant="secondary" className="w-fit mt-1">{family.name}</Badge>}
        </div>
        <Button variant="outline" onClick={() => {}}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </Card>

      {/* Personal Information */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Personal Information" />
        <Card className="flex flex-col divide-y divide-border p-5">
          <SettingRow icon={User} label="Full name" value={user?.name} />
          <SettingRow icon={Mail} label="Email" value={user?.email} />
          <SettingRow icon={Phone} label="Phone" value={user?.phone} />
          {family && <SettingRow icon={MapPin} label="Address" value={`${family.address.line1}, ${family.address.city}`} />}
        </Card>
      </section>

      {/* Security */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Security" />
        <Card className="flex flex-col divide-y divide-border p-5">
          <SettingRow icon={Lock} label="Change password" />
          <SettingRow icon={Shield} label="Two-factor authentication" value="Not enabled" />
          <SettingRow icon={User} label="Remembered devices" value="1 device" />
        </Card>
      </section>

      {/* Linked Members */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Linked Members" actions={<Button variant="outline" size="sm" onClick={() => navigate('/portal/family/members')}>Manage</Button>} />
        <Card className="flex flex-col divide-y divide-border p-5">
          <SettingRow icon={Users} label="Family members" value={`${family?.members.length ?? 0} members`} onClick={() => navigate('/portal/family/members')} />
          <SettingRow icon={Phone} label="Emergency contacts" value={`${family?.emergencyContacts?.length ?? 0} contacts`} />
        </Card>
      </section>

      {/* Addresses */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Addresses" />
        <Card className="flex flex-col p-5">
          {family && (
            <div className="flex items-start gap-3 py-2">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Home</span>
                <span className="text-xs text-muted-foreground">{family.address.line1}, {family.address.city}, {family.address.state} {family.address.postalCode}</span>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Preferences */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Preferences" />
        <Card className="flex flex-col divide-y divide-border p-5">
          <SettingRow icon={Globe} label="Language" value="English" />
          <ToggleRow label="Push notifications" description="Receive alerts on your device" defaultOn />
          <ToggleRow label="Email notifications" description="Receive updates via email" defaultOn />
          <ToggleRow label="SMS notifications" description="Receive alerts via SMS" defaultOn={false} />
        </Card>
      </section>

      {/* Privacy */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="Privacy" />
        <Card className="flex flex-col divide-y divide-border p-5">
          <ToggleRow label="Share location with providers" description="Enable for emergency dispatch" defaultOn />
          <ToggleRow label="Share medical history" description="Allow providers to view records" defaultOn />
          <SettingRow icon={Lock} label="Data & privacy" value="Manage your data" />
        </Card>
      </section>

      {/* Logout */}
      <Button variant="destructive" onClick={handleLogout} className="w-full">
        <LogOut className="mr-2 h-4 w-4" /> Sign out
      </Button>
    </div>
  );
};

export default FamilyProfilePage;
