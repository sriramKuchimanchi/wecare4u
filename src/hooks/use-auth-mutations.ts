import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { QUERY_KEYS } from '@/constants';
import type { OtpChannel, ProviderRegistrationType } from '@/types';

export function useLoginMutation() {
  const setSession = useAuthStore((s) => s.setSession);
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ email, password, remember }: { email: string; password: string; remember?: boolean }) =>
      authService.login(email, password, remember),
    onSuccess: (result) => {
      if (result.success && result.data) {
        setSession(result.data);
        toast({ title: 'Welcome back', description: 'You have signed in successfully.' });
      }
    },
  });
}

export function useLoginProviderMutation() {
  const setSession = useAuthStore((s) => s.setSession);
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ email, password, remember }: { email: string; password: string; remember?: boolean }) =>
      authService.loginProvider(email, password, remember),
    onSuccess: (result) => {
      if (result.success && result.data) {
        setSession(result.data);
        toast({ title: 'Welcome back', description: 'Provider sign-in successful.' });
      }
    },
  });
}

export function useLoginEmployeeMutation() {
  const setSession = useAuthStore((s) => s.setSession);
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ identifier, password, remember }: { identifier: string; password: string; remember?: boolean }) =>
      authService.loginEmployee(identifier, password, remember),
    onSuccess: (result) => {
      if (result.success && result.data) {
        setSession(result.data);
        toast({ title: 'Welcome back', description: 'Employee sign-in successful.' });
      }
    },
  });
}

export function useLoginAdminMutation() {
  const setSession = useAuthStore((s) => s.setSession);
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ email, password, remember }: { email: string; password: string; remember?: boolean }) =>
      authService.loginAdmin(email, password, remember),
    onSuccess: (result) => {
      if (result.success && result.data) {
        setSession(result.data);
        toast({ title: 'Administrator signed in', description: 'Welcome to the admin portal.' });
      }
    },
  });
}

export function useSendOtpMutation() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ channel, target }: { channel: OtpChannel; target: string }) =>
      authService.sendOtp(channel, target),
    onSuccess: (result) => {
      if (result.success) {
        toast({ title: 'OTP sent', description: 'A verification code has been sent.' });
      }
    },
  });
}

export function useVerifyOtpMutation() {
  const setSession = useAuthStore((s) => s.setSession);
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ target, otp, remember }: { target: string; otp: string; remember?: boolean }) =>
      authService.verifyOtp(target, otp, remember),
    onSuccess: (result) => {
      if (result.success && result.data) {
        setSession(result.data);
        toast({ title: 'Verified', description: 'Phone number verified successfully.' });
      }
    },
  });
}

export function useRegisterFamilyMutation() {
  const setSession = useAuthStore((s) => s.setSession);
  const { toast } = useToast();
  return useMutation({
    mutationFn: authService.registerFamily,
    onSuccess: (result) => {
      if (result.success && result.data) {
        setSession(result.data);
        toast({ title: 'Account created', description: 'Welcome to We Care For You.' });
      }
    },
  });
}

export function useRegisterProviderMutation() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: authService.registerProvider,
    onSuccess: (result) => {
      if (result.success) {
        toast({ title: 'Registration submitted', description: 'Your application is pending verification.' });
      }
    },
  });
}

export function useForgotPasswordMutation() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (result) => {
      if (result.success) {
        toast({ title: 'Reset link sent', description: 'Check your email for a reset link.' });
      }
    },
  });
}

export function useResetPasswordMutation() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
    onSuccess: (result) => {
      if (result.success) {
        toast({ title: 'Password reset', description: 'Your password has been updated.' });
      }
    },
  });
}

export function useLogoutMutation() {
  const reset = useAuthStore((s) => s.reset);
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => reset(),
  });
}

export function useValidateSessionQuery(enabled = true) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: () => authService.validateSession(token ?? ''),
    enabled: enabled && Boolean(token),
    retry: false,
  });
}

export function useCompleteOnboardingMutation() {
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => authService.completeOnboarding(),
    onSuccess: (result) => {
      if (result.success) {
        setOnboardingCompleted(true);
        toast({ title: 'Onboarding complete', description: 'Welcome aboard!' });
      }
    },
  });
}
