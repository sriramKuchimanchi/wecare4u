import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Heart, Users, Briefcase, Shield, ArrowLeft, ArrowRight } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { FormWrapper, TextField, CheckboxField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  loginSchema, providerLoginSchema, employeeLoginSchema, adminLoginSchema, otpVerifySchema, phoneSchema,
  type LoginInput, type ProviderLoginInput, type EmployeeLoginInput, type AdminLoginInput,
} from '@/lib/schemas';
import {
  useLoginMutation, useLoginProviderMutation, useLoginEmployeeMutation, useLoginAdminMutation,
  useSendOtpMutation, useVerifyOtpMutation,
} from '@/hooks/use-auth-mutations';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { ROLE_LABELS } from '@/constants';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

type LoginRole = UserRole;

const roleCards: { role: LoginRole; label: string; description: string; icon: typeof Users }[] = [
  { role: 'family', label: 'Family', description: 'Coordinate care for your loved ones.', icon: Heart },
  { role: 'care-provider', label: 'Care Provider', description: 'Manage your care services.', icon: Briefcase },
  { role: 'employee', label: 'Employee', description: 'Access your tasks and schedule.', icon: Users },
  { role: 'admin', label: 'Admin', description: 'Platform administration.', icon: Shield },
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
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [remember, setRemember] = useState(true);
  const sendOtp = useSendOtpMutation();
  const verifyOtp = useVerifyOtpMutation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const countdown = useCountdown(60, otpSent);

  const handleSendOtp = async () => {
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      toast({ title: 'Invalid phone', description: parsed.error.issues[0]?.message, variant: 'destructive' });
      return;
    }
    const result = await sendOtp.mutateAsync({ channel: 'sms', target: phone });
    if (result.success) setOtpSent(true);
  };

  const handleVerify = async () => {
    if (otp.length < 4) {
      toast({ title: 'Enter OTP', description: 'Enter the 4–6 digit code sent to your phone.', variant: 'destructive' });
      return;
    }
    const result = await verifyOtp.mutateAsync({ target: phone, otp, remember });
    if (result.success && result.data) {
      navigate(ROUTES.family, { replace: true });
    } else if (!result.success) {
      toast({ title: 'Verification failed', description: result.error?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
          <p className="text-xs text-muted-foreground">A 4–6 digit code was sent to {phone}.</p>
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
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={countdown > 0 || sendOtp.isPending}
              className={cn('font-medium', countdown > 0 ? 'text-muted-foreground' : 'text-primary hover:underline')}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
            </button>
            <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="font-medium text-muted-foreground hover:text-foreground">
              Change number
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ProviderLoginForm = () => {
  const navigate = useNavigate();
  const login = useLoginProviderMutation();
  const onSubmit = async (values: ProviderLoginInput) => {
    const result = await login.mutateAsync({ email: values.email, password: values.password, remember: values.remember });
    if (result.success && result.data) navigate(ROUTES.careProvider, { replace: true });
  };
  return (
    <FormWrapper schema={providerLoginSchema} onSubmit={onSubmit} defaultValues={{ email: '', password: '', remember: false }}>
      {() => (
        <>
          <TextField name="email" label="Email" type="email" required placeholder="provider@example.com" autoComplete="email" />
          <TextField name="password" label="Password" type="password" required placeholder="••••••••" autoComplete="current-password" />
          <div className="flex items-center justify-between">
            <CheckboxField name="remember" label="Remember me" checkboxLabel="Keep me signed in" />
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" disabled={login.isPending} className="w-full">
            {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </>
      )}
    </FormWrapper>
  );
};

const EmployeeLoginForm = () => {
  const navigate = useNavigate();
  const login = useLoginEmployeeMutation();
  const onSubmit = async (values: EmployeeLoginInput) => {
    const result = await login.mutateAsync({ identifier: values.identifier, password: values.password, remember: values.remember });
    if (result.success && result.data) navigate(ROUTES.employee, { replace: true });
  };
  return (
    <FormWrapper schema={employeeLoginSchema} onSubmit={onSubmit} defaultValues={{ identifier: '', password: '', remember: false }}>
      {() => (
        <>
          <TextField name="identifier" label="Employee ID or Email" required placeholder="EMP-1234 or you@example.com" autoComplete="username" />
          <TextField name="password" label="Password" type="password" required placeholder="••••••••" autoComplete="current-password" />
          <CheckboxField name="remember" label="Remember me" checkboxLabel="Keep me signed in" />
          <Button type="submit" disabled={login.isPending} className="w-full">
            {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </>
      )}
    </FormWrapper>
  );
};

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const login = useLoginAdminMutation();
  const onSubmit = async (values: AdminLoginInput) => {
    const result = await login.mutateAsync({ email: values.email, password: values.password, remember: values.remember });
    if (result.success && result.data) navigate(ROUTES.admin, { replace: true });
  };
  return (
    <FormWrapper schema={adminLoginSchema} onSubmit={onSubmit} defaultValues={{ email: '', password: '', remember: false }}>
      {() => (
        <>
          <TextField name="email" label="Admin Email" type="email" required placeholder="admin@lomaa.com" autoComplete="email" />
          <TextField name="password" label="Password" type="password" required placeholder="••••••••" autoComplete="current-password" />
          <CheckboxField name="remember" label="Remember me" checkboxLabel="Keep me signed in" />
          <Button type="submit" disabled={login.isPending} className="w-full">
            {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Administrator sign in
          </Button>
        </>
      )}
    </FormWrapper>
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

  return (
    <AuthLayout
      title={selectedRole ? `Sign in as ${ROLE_LABELS[selectedRole]}` : 'Welcome back'}
      subtitle={selectedRole ? 'Enter your credentials to continue.' : 'Choose your account type to sign in.'}
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
              onClick={() => setSelectedRole(card.role)}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-primary hover:shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <card.icon className="h-5 w-5" />
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold text-foreground">{card.label}</span>
                <span className="text-xs text-muted-foreground">{card.description}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
