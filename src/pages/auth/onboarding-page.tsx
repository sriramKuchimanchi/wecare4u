import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Bell, MapPin, Shield, Briefcase, User, Sparkles } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { useCompleteOnboardingMutation } from '@/hooks/use-auth-mutations';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const PermissionToggle = ({ icon: Icon, title, description, defaultOn }: { icon: typeof Bell; title: string; description: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn ?? true);
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', on ? 'bg-primary' : 'bg-muted')}
        aria-pressed={on}
        aria-label={title}
      >
        <span className={cn('absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform', on ? 'translate-x-5' : 'translate-x-0')} />
      </button>
    </div>
  );
};

const familySteps = [
  {
    title: 'Welcome to We Care For You',
    body: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>We&apos;re glad you&apos;re here. We Care For You helps you coordinate care for your loved ones — from bookings to emergency response — all in one place.</p>
        <p>This quick introduction will help you get the most out of the platform.</p>
      </div>
    ),
  },
  {
    title: 'Permissions',
    body: (
      <div className="flex flex-col gap-3">
        <PermissionToggle icon={Bell} title="Notifications" description="Receive alerts for bookings, emergencies and updates." defaultOn />
        <PermissionToggle icon={MapPin} title="Location" description="Enable location for emergency dispatch and nearby providers." defaultOn />
      </div>
    ),
  },
  {
    title: 'You&apos;re all set',
    body: (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="h-8 w-8" />
        </div>
        <p className="text-sm text-muted-foreground">Your family account is ready. Let&apos;s start coordinating care.</p>
      </div>
    ),
  },
];

const providerSteps = [
  {
    title: 'Welcome, Care Provider',
    body: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>Thank you for joining. Your registration is being reviewed by our admin team.</p>
        <p>Once verified, you&apos;ll be able to manage bookings, staff and patient relationships.</p>
      </div>
    ),
  },
  {
    title: 'Verification Status',
    body: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <Shield className="h-5 w-5 text-warning" />
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-foreground">Pending Verification</span>
            <span className="text-xs text-muted-foreground">Your account will become active after admin verification.</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-foreground">Business Overview</span>
            <span className="text-xs text-muted-foreground">Set up your services, staff and availability after verification.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Next Steps',
    body: (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="h-8 w-8" />
        </div>
        <p className="text-sm text-muted-foreground">You&apos;ll receive an email once verification is complete. Thank you for your patience.</p>
      </div>
    ),
  },
];

const employeeSteps = [
  {
    title: 'Welcome aboard',
    body: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>Welcome! You&apos;re now part of the We Care For You care team.</p>
        <p>Your assigned organization and tasks will appear here once they&apos;re scheduled.</p>
      </div>
    ),
  },
  {
    title: 'Assigned Organization',
    body: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-foreground">Sunrise Home Care</span>
            <span className="text-xs text-muted-foreground">Your assigned care provider organization.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Complete your profile',
    body: (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-8 w-8" />
        </div>
        <p className="text-sm text-muted-foreground">Add your profile photo and specialization to help families get to know you.</p>
      </div>
    ),
  },
];

const stepSets = {
  family: familySteps,
  'care-provider': providerSteps,
  employee: employeeSteps,
  admin: familySteps,
};

export const OnboardingPage = () => {
  const role = useAuthStore((s) => s.role);
  const completeOnboarding = useCompleteOnboardingMutation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = stepSets[role ?? 'family'];
  const isLast = step === steps.length - 1;

  const handleFinish = async () => {
    await completeOnboarding.mutateAsync();
    navigate(role ? ROUTES[role === 'care-provider' ? 'careProvider' : role] : '/', { replace: true });
  };

  return (
    <AuthLayout title="Let&apos;s get you started" subtitle="A quick setup to personalize your experience.">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5 pb-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={cn('h-1.5 flex-1 rounded-full transition-colors', idx <= step ? 'bg-primary' : 'bg-muted')}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-foreground">{steps[step].title}</h2>
          {steps[step].body}
        </div>
        <div className="flex gap-2 pt-2">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
              Back
            </Button>
          )}
          {!isLast ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)} className="flex-1">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleFinish} disabled={completeOnboarding.isPending} className="flex-1">
              <Sparkles className="mr-2 h-4 w-4" /> Finish
            </Button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default OnboardingPage;
