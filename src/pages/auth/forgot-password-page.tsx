import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { FormWrapper, TextField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas';
import { useForgotPasswordMutation } from '@/hooks/use-auth-mutations';
import { useState } from 'react';

export const ForgotPasswordPage = () => {
  const forgot = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: ForgotPasswordInput) => {
    await forgot.mutateAsync(values.email);
    setSent(true);
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">Back to Login</Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <ArrowLeft className="h-7 w-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
            <p className="text-sm text-muted-foreground">We&apos;ve sent a password reset link to your email address.</p>
          </div>
          <Button onClick={() => navigate('/login')} className="w-full">Return to Login</Button>
        </div>
      ) : (
        <FormWrapper schema={forgotPasswordSchema} onSubmit={onSubmit} defaultValues={{ email: '' }}>
          {() => (
            <>
              <TextField name="email" label="Email" type="email" required placeholder="you@example.com" autoComplete="email" />
              <Button type="submit" disabled={forgot.isPending} className="w-full">
                {forgot.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send reset link
              </Button>
            </>
          )}
        </FormWrapper>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
