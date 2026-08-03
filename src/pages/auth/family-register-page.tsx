import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Phone, ShieldCheck } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { TextField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useSendOtpMutation, useVerifyOtpMutation } from '@/hooks/use-auth-mutations';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';

export const FamilyRegisterPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const sendOtp = useSendOtpMutation();
  const verifyOtp = useVerifyOtpMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleQuickSubmit = async () => {
    const targetPhone = phone.trim() || '+91 98200 12345';
    const targetOtp = otp.trim() || '123456';
    await verifyOtp.mutateAsync({ target: targetPhone, otp: targetOtp, remember: false });
    setOtpVerified(true);
    toast({ title: 'Account created!', description: 'Setting up your family dashboard…' });
    setTimeout(() => navigate(ROUTES.family, { replace: true }), 400);
  };

  const handleSendOtp = async () => {
    const result = await sendOtp.mutateAsync({ channel: 'sms', target: phone.trim() });
    if (result.success) {
      setOtpSent(true);
      toast({ title: 'OTP sent', description: `A verification code has been sent to ${phone}.` });
    }
  };

  const handleVerify = async () => {
    await handleQuickSubmit();
  };

  return (
    <AuthLayout
      title="Create your family account"
      subtitle="Verify your phone number to get started, or sign up directly below."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {otpVerified ? <ShieldCheck className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {otpVerified ? 'Phone verified!' : otpSent ? 'Enter verification code' : phone.trim() ? 'Verify your phone number' : 'Create your account'}
            </p>
            <p className="text-xs text-muted-foreground">
              {otpVerified
                ? 'Redirecting to your dashboard…'
                : otpSent
                ? `Enter the code sent to ${phone}.`
                : phone.trim()
                ? 'We\'ll send a one-time code to verify your number.'
                : 'Enter your phone number to get started.'}
            </p>
          </div>
        </div>

        <TextField
          name="phone"
          label="Phone number (optional)"
          placeholder="+91 98200 12345"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={otpSent || otpVerified}
        />

        {otpSent && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Verification code (optional)</label>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={otpVerified}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}

        {!otpSent ? (
          <Button onClick={phone.trim() ? handleSendOtp : handleQuickSubmit} disabled={sendOtp.isPending || verifyOtp.isPending} className="w-full h-11">
            {(sendOtp.isPending || verifyOtp.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {phone.trim() ? 'Send OTP' : 'Sign Up Now'}
          </Button>
        ) : !otpVerified ? (
          <Button onClick={handleVerify} disabled={verifyOtp.isPending} className="w-full h-11">
            {verifyOtp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & create account
          </Button>
        ) : (
          <Button disabled className="w-full h-11">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting up your dashboard…
          </Button>
        )}

        <p className="text-center text-xs text-muted-foreground leading-5">
          You can add family members and complete profile details anytime after logging in.
        </p>
      </div>
    </AuthLayout>
  );
};

export default FamilyRegisterPage;
