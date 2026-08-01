import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Heart, Users, Briefcase, Shield, ArrowLeft, ArrowRight, Sparkles } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { FormWrapper, TextField, CheckboxField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  providerLoginSchema, employeeLoginSchema, adminLoginSchema,
  type ProviderLoginInput, type EmployeeLoginInput, type AdminLoginInput,
} from '@/lib/schemas';
import {
  useLoginProviderMutation, useLoginEmployeeMutation, useLoginAdminMutation,
  useSendOtpMutation, useVerifyOtpMutation,
} from '@/hooks/use-auth-mutations';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { ROLE_LABELS } from '@/constants';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { mockUsers } from '@/utils/mock-data';

type LoginRole = UserRole;

const roleCards: { role: LoginRole; label: string; description: string; icon: typeof Users }[] = [
  { role: 'care-provider', label: 'Care Provider Portal', description: 'Operations, employee management & requests.', icon: Briefcase },
  { role: 'employee', label: 'Employee Field Portal', description: 'Patient schedule, care notes & status workflow.', icon: Users },
  { role: 'family', label: 'Family Portal', description: 'Coordinate care & track family health.', icon: Heart },
  { role: 'admin', label: 'Admin Portal', description: 'Platform administration & metrics.', icon: Shield },
];

const useCountdown = (initial: number, active: boolean) => {
  const [seconds, setSeconds] = useState(initial);
  useEffect(() => {
    if (!active) return;
    setSeconds(initial);
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [initial, active]);
  return seconds;
};

const FamilyLoginForm = () => {
  const [phone, setPhone] = useState('+971 50 123 4567');
  const [otp, setOtp] = useState('1234');
  const [otpSent, setOtpSent] = useState(false);
  const [remember, setRemember] = useState(true);
  const sendOtp = useSendOtpMutation();
  const verifyOtp = useVerifyOtpMutation();
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const countdown = useCountdown(60, otpSent);

  const handleQuickDemoLogin = () => {
    const user = mockUsers.find((u) => u.role === 'family')!;
    setSession({
      user,
      token: `mock_token_${user.id}`,
      refreshToken: `mock_refresh_${user.id}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      permissions: ['family:read', 'family:write'],
      verificationStatus: 'verified',
      onboardingCompleted: true,
    });
    navigate(ROUTES.family, { replace: true });
  };

  const handleSendOtp = async () => {
    await sendOtp.mutateAsync({ channel: 'sms', target: phone || '+971 50 123 4567' });
    setOtpSent(true);
  };

  const handleVerify = async () => {
    await verifyOtp.mutateAsync({ target: phone || '+971 50 123 4567', otp: otp || '1234', remember });
    navigate(ROUTES.family, { replace: true });
  };

  return (
    <div className="flex flex-col gap-4">
      <Button type="button" onClick={handleQuickDemoLogin} variant="secondary" className="w-full bg-primary/10 text-primary hover:bg-primary/20">
        <Sparkles className="mr-2 h-4 w-4" /> Instant Demo Sign In (Family)
      </Button>

      <div className="relative my-1 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <span className="relative bg-surface px-2 text-2xs text-muted-foreground uppercase">or enter details</span>
      </div>

      <TextField
        name="phone"
        label="Phone number"
        required
        placeholder="+971 50 123 4567"
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={otpSent}
      />
      {otpSent && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Enter OTP</label>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-11 w-11" />
              <InputOTPSlot index={1} className="h-11 w-11" />
              <InputOTPSlot index={2} className="h-11 w-11" />
              <InputOTPSlot index={3} className="h-11 w-11" />
              <InputOTPSlot index={4} className="h-11 w-11" />
              <InputOTPSlot index={5} className="h-11 w-11" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-input text-primary" />
        Remember this device
      </label>
      {!otpSent ? (
        <Button onClick={handleSendOtp} disabled={sendOtp.isPending} className="w-full">
          {sendOtp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send OTP
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <Button onClick={handleVerify} disabled={verifyOtp.isPending} className="w-full">
            {verifyOtp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & sign in
          </Button>
        </div>
      )}
    </div>
  );
};

const ProviderLoginForm = () => {
  const navigate = useNavigate();
  const login = useLoginProviderMutation();
  const setSession = useAuthStore((s) => s.setSession);

  const handleQuickDemoLogin = () => {
    const user = mockUsers.find((u) => u.role === 'care-provider')!;
    setSession({
      user,
      token: `mock_token_${user.id}`,
      refreshToken: `mock_refresh_${user.id}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      permissions: ['provider:read', 'provider:write'],
      verificationStatus: 'verified',
      onboardingCompleted: true,
    });
    navigate(ROUTES.careProvider, { replace: true });
  };

  const onSubmit = async (values: ProviderLoginInput) => {
    await login.mutateAsync({ email: values.email || 'omar.provider@example.com', password: values.password || 'password123', remember: values.remember });
    navigate(ROUTES.careProvider, { replace: true });
  };

  return (
    <div className="space-y-4">
      <Button type="button" onClick={handleQuickDemoLogin} variant="secondary" className="w-full bg-primary/10 text-primary hover:bg-primary/20">
        <Sparkles className="mr-2 h-4 w-4" /> Instant Demo Sign In (Care Provider)
      </Button>

      <div className="relative my-1 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <span className="relative bg-surface px-2 text-2xs text-muted-foreground uppercase">or enter credentials</span>
      </div>

      <FormWrapper schema={providerLoginSchema} onSubmit={onSubmit} defaultValues={{ email: 'omar.provider@example.com', password: 'password123', remember: true }}>
        {() => (
          <>
            <TextField name="email" label="Email" type="email" placeholder="omar.provider@example.com" autoComplete="email" />
            <TextField name="password" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />
            <div className="flex items-center justify-between">
              <CheckboxField name="remember" label="Remember me" checkboxLabel="Keep me signed in" />
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" disabled={login.isPending} className="w-full">
              {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in to Provider Portal
            </Button>
          </>
        )}
      </FormWrapper>
    </div>
  );
};

const EmployeeLoginForm = () => {
  const navigate = useNavigate();
  const login = useLoginEmployeeMutation();
  const setSession = useAuthStore((s) => s.setSession);

  const handleQuickDemoLogin = () => {
    const user = mockUsers.find((u) => u.role === 'employee')!;
    setSession({
      user,
      token: `mock_token_${user.id}`,
      refreshToken: `mock_refresh_${user.id}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      permissions: ['employee:read'],
      verificationStatus: 'verified',
      onboardingCompleted: true,
    });
    navigate(ROUTES.employee, { replace: true });
  };

  const onSubmit = async (values: EmployeeLoginInput) => {
    await login.mutateAsync({ identifier: values.identifier || 'layla.employee@example.com', password: values.password || 'password123', remember: values.remember });
    navigate(ROUTES.employee, { replace: true });
  };

  return (
    <div className="space-y-4">
      <Button type="button" onClick={handleQuickDemoLogin} variant="secondary" className="w-full bg-primary/10 text-primary hover:bg-primary/20">
        <Sparkles className="mr-2 h-4 w-4" /> Instant Demo Sign In (Employee)
      </Button>

      <div className="relative my-1 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <span className="relative bg-surface px-2 text-2xs text-muted-foreground uppercase">or enter credentials</span>
      </div>

      <FormWrapper schema={employeeLoginSchema} onSubmit={onSubmit} defaultValues={{ identifier: 'layla.employee@example.com', password: 'password123', remember: true }}>
        {() => (
          <>
            <TextField name="identifier" label="Employee ID or Email" placeholder="EMP-1234 or layla.employee@example.com" autoComplete="username" />
            <TextField name="password" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />
            <CheckboxField name="remember" label="Remember me" checkboxLabel="Keep me signed in" />
            <Button type="submit" disabled={login.isPending} className="w-full">
              {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in to Employee Portal
            </Button>
          </>
        )}
      </FormWrapper>
    </div>
  );
};

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const login = useLoginAdminMutation();
  const setSession = useAuthStore((s) => s.setSession);

  const handleQuickDemoLogin = () => {
    const user = mockUsers.find((u) => u.role === 'admin')!;
    setSession({
      user,
      token: `mock_token_${user.id}`,
      refreshToken: `mock_refresh_${user.id}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      permissions: ['admin:all'],
      verificationStatus: 'verified',
      onboardingCompleted: true,
    });
    navigate(ROUTES.admin, { replace: true });
  };

  const onSubmit = async (values: AdminLoginInput) => {
    await login.mutateAsync({ email: values.email || 'admin@lomaa.com', password: values.password || 'lomaa123', remember: values.remember });
    navigate(ROUTES.admin, { replace: true });
  };

  return (
    <div className="space-y-4">
      <Button type="button" onClick={handleQuickDemoLogin} variant="secondary" className="w-full bg-primary/10 text-primary hover:bg-primary/20">
        <Sparkles className="mr-2 h-4 w-4" /> Instant Demo Sign In (Admin)
      </Button>

      <FormWrapper schema={adminLoginSchema} onSubmit={onSubmit} defaultValues={{ email: 'admin@lomaa.com', password: 'lomaa123', remember: true }}>
        {() => (
          <>
            <TextField name="email" label="Admin Email" type="email" placeholder="admin@lomaa.com" autoComplete="email" />
            <TextField name="password" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />
            <CheckboxField name="remember" label="Remember me" checkboxLabel="Keep me signed in" />
            <Button type="submit" disabled={login.isPending} className="w-full">
              {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Administrator sign in
            </Button>
          </>
        )}
      </FormWrapper>
    </div>
  );
};

const roleForms: Record<LoginRole, React.ReactNode> = {
  family: <FamilyLoginForm />,
  'care-provider': <ProviderLoginForm />,
  employee: <EmployeeLoginForm />,
  admin: <AdminLoginForm />,
};

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<LoginRole | null>(null);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const handleRoleCardClick = (role: LoginRole) => {
    // Instant session set and direct navigation to portal for smooth UX
    const user = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
    setSession({
      user,
      token: `mock_token_${user.id}`,
      refreshToken: `mock_refresh_${user.id}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      permissions: ['read', 'write'],
      verificationStatus: 'verified',
      onboardingCompleted: true,
    });
    navigate(ROUTES[role === 'care-provider' ? 'careProvider' : role], { replace: true });
  };

  return (
    <AuthLayout
      title={selectedRole ? `Sign in as ${ROLE_LABELS[selectedRole]}` : 'Welcome back'}
      subtitle={selectedRole ? 'Enter your credentials to continue.' : 'Select an account type below to log in.'}
      footer={
        <>
          New to the platform?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
        </>
      }
    >
      {!selectedRole ? (
        <div className="flex flex-col gap-3">
          {roleCards.map((card) => (
            <button
              key={card.role}
              type="button"
              onClick={() => handleRoleCardClick(card.role)}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-primary hover:shadow-soft group"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <card.icon className="h-5 w-5" />
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {card.label}
                  <span className="text-2xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Click to Login</span>
                </span>
                <span className="text-xs text-muted-foreground">{card.description}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setSelectedRole(null)}
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Choose a different role
          </button>
          {roleForms[selectedRole]}
        </div>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
