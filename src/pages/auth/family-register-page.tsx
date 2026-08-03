import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, ArrowRight, Check, Upload, SkipForward } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { FormWrapper, TextField, SelectField, CheckboxField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  familyStep1Schema, familyStep2Schema, familyStep3Schema,
  type FamilyStep1Input, type FamilyStep2Input, type FamilyStep3Input,
} from '@/lib/schemas';
import { useSendOtpMutation, useRegisterFamilyMutation } from '@/hooks/use-auth-mutations';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const steps = ['Your details', 'Create family', 'Add member'];
const demoFamilyStep1: FamilyStep1Input = {
  name: 'Aaradhya Rao', email: 'aaradhya.family@example.com', phone: '+91 98200 12345', otp: '123456', acceptTerms: true,
};
const demoFamilyStep2: FamilyStep2Input = {
  familyName: 'Rao Family', address: '12 Care Avenue', state: 'Andhra Pradesh', district: 'East Godavari', city: 'Vizag', pincode: '530001', emergencyContact: '+91 98200 12345',
};
const demoFamilyStep3: FamilyStep3Input = {
  memberName: 'Madhav Rao', relationship: 'Father', gender: 'male', dob: '1958-05-12', bloodGroup: 'A+', medicalConditions: '', allergies: '', insuranceProvider: '', memberEmergencyContact: '', governmentIdType: 'aadhaar', governmentIdNumber: '1234567890',
};

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center gap-2 pb-4">
    {steps.map((label, idx) => (
      <div key={label} className="flex flex-1 items-center gap-2">
        <div
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
            idx < current && 'bg-primary text-primary-foreground',
            idx === current && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
            idx > current && 'bg-muted text-muted-foreground',
          )}
        >
          {idx < current ? <Check className="h-3.5 w-3.5" /> : idx + 1}
        </div>
        <span className={cn('hidden text-xs font-medium sm:block', idx <= current ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
        {idx < steps.length - 1 && <div className={cn('h-px flex-1', idx < current ? 'bg-primary' : 'bg-border')} />}
      </div>
    ))}
  </div>
);

const FileUploadField = ({ label, hint }: { label: string; hint?: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium">{label}</label>
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground hover:border-primary hover:bg-primary/5">
      <Upload className="h-4 w-4" />
      <span>Tap to upload</span>
      <input type="file" className="hidden" />
    </label>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

export const FamilyRegisterPage = () => {
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState<FamilyStep1Input | null>(null);
  const [step2Data, setStep2Data] = useState<FamilyStep2Input | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const sendOtp = useSendOtpMutation();
  const register = useRegisterFamilyMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (phone.trim().length < 7) {
      toast({ title: 'Enter phone', description: 'Enter a valid phone number first.', variant: 'destructive' });
      return;
    }
    const result = await sendOtp.mutateAsync({ channel: 'sms', target: phone });
    if (result.success) setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      toast({ title: 'Enter OTP', description: 'Enter the 4–6 digit code.', variant: 'destructive' });
      return;
    }
    setOtpVerified(true);
    toast({ title: 'Phone verified', description: 'Your phone number has been verified.' });
  };

  const useDemoData = () => {
    setPhone(demoFamilyStep1.phone);
    setOtp(demoFamilyStep1.otp);
    setStep1Data(demoFamilyStep1);
    setStep(1);
  };

  const onStep1Submit = (values: FamilyStep1Input) => {
    setStep1Data({ ...values, phone, otp });
    setStep(1);
  };

  const onStep2Submit = (values: FamilyStep2Input) => {
    setStep2Data(values);
    setStep(2);
  };

  const onStep3Submit = async (values: FamilyStep3Input) => {
    if (!step1Data || !step2Data) return;
    const result = await register.mutateAsync({
      name: step1Data.name,
      email: step1Data.email,
      phone: step1Data.phone,
      familyName: step2Data.familyName,
      address: step2Data.address,
      state: step2Data.state,
      district: step2Data.district,
      city: step2Data.city,
      pincode: step2Data.pincode,
      emergencyContact: step2Data.emergencyContact,
      member: {
        name: values.memberName,
        relationship: values.relationship,
        gender: values.gender,
        dob: values.dob,
        bloodGroup: values.bloodGroup,
        medicalConditions: values.medicalConditions,
        allergies: values.allergies,
        insuranceProvider: values.insuranceProvider,
        emergencyContact: values.memberEmergencyContact,
        governmentIdType: values.governmentIdType,
        governmentIdNumber: values.governmentIdNumber,
      },
    });
    if (result.success && result.data) {
      navigate(ROUTES.family, { replace: true });
    }
  };

  const skipMember = async () => {
    if (!step1Data || !step2Data) return;
    const result = await register.mutateAsync({
      name: step1Data.name,
      email: step1Data.email,
      phone: step1Data.phone,
      familyName: step2Data.familyName,
      address: step2Data.address,
      state: step2Data.state,
      district: step2Data.district,
      city: step2Data.city,
      pincode: step2Data.pincode,
      emergencyContact: step2Data.emergencyContact,
    });
    if (result.success && result.data) navigate(ROUTES.family, { replace: true });
  };

  return (
    <AuthLayout
      title="Create your family account"
      subtitle="Register to coordinate care for your loved ones."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
        </>
      }
    >
      <StepIndicator current={step} />

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <TextField name="name" label="Full name" required placeholder="Aaradhya Rao" value={step1Data?.name ?? ''} onChange={() => {}} />
          <TextField name="email" label="Email" type="email" required placeholder="you@example.com" value={step1Data?.email ?? ''} onChange={() => {}} />
          <TextField name="phone" label="Phone number" required placeholder="+971 50 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} />
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
          <CheckboxField name="acceptTerms" label="Terms" checkboxLabel="I agree to the Terms of Service and Privacy Policy." />
          {!otpVerified ? (
            !otpSent ? (
              <Button onClick={handleSendOtp} disabled={sendOtp.isPending} className="w-full">
                {sendOtp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Send OTP
              </Button>
            ) : (
              <Button onClick={handleVerifyOtp} className="w-full">Verify OTP</Button>
            )
          ) : (
            <Button onClick={() => {
              if (!step1Data) setStep1Data({ name: '', email: '', phone, otp, acceptTerms: true });
              setStep(1);
            }} className="w-full">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {/* <Button type="button" variant="outline" onClick={useDemoData} className="w-full">
            Continue with demo data
          </Button> */}
        </div>
      )}

      {step === 1 && (
        <FormWrapper schema={familyStep2Schema} onSubmit={onStep2Submit} defaultValues={step2Data ?? demoFamilyStep2}>
          {() => (
            <div className="flex flex-col gap-4">
              <TextField name="familyName" label="Family name" required placeholder="Rahman Family" />
              <TextField name="address" label="Address" required placeholder="Street, building, unit" />
              <div className="grid grid-cols-2 gap-3">
                <TextField name="state" label="State" required placeholder="Dubai" />
                <TextField name="district" label="District" required placeholder="Dubai Marina" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField name="city" label="City" required placeholder="Dubai" />
                <TextField name="pincode" label="Pincode" required placeholder="00000" />
              </div>
              <TextField name="emergencyContact" label="Emergency contact" required placeholder="+971 50 123 4567" />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="button" onClick={() => onStep2Submit(demoFamilyStep2)} className="flex-1">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </FormWrapper>
      )}

      {step === 2 && (
        <FormWrapper schema={familyStep3Schema} onSubmit={onStep3Submit} defaultValues={demoFamilyStep3}>
          {() => (
            <div className="flex flex-col gap-4">
              <TextField name="memberName" label="Full name" required placeholder="Madhav Rao" />
              <div className="grid grid-cols-2 gap-3">
                <TextField name="relationship" label="Relationship" required placeholder="Father" />
                <SelectField name="gender" label="Gender" required options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField name="dob" label="Date of birth" required type="date" />
                <SelectField name="bloodGroup" label="Blood group" required options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => ({ value: b, label: b }))} />
              </div>
              <TextField name="medicalConditions" label="Medical conditions" placeholder="Hypertension, diabetes…" />
              <TextField name="allergies" label="Allergies" placeholder="Penicillin, peanuts…" />
              <TextField name="insuranceProvider" label="Insurance provider" placeholder="Insurance Co." />
              <TextField name="memberEmergencyContact" label="Emergency contact" placeholder="+971 50 123 4567" />
              <div className="grid grid-cols-2 gap-3">
                <SelectField name="governmentIdType" label="Government ID type" required options={[{ value: 'passport', label: 'Passport' }, { value: 'aadhaar', label: 'Aadhaar' }, { value: 'driving-license', label: 'Driving License' }, { value: 'national-id', label: 'National ID' }, { value: 'other', label: 'Other' }]} />
                <TextField name="governmentIdNumber" label="ID number" required placeholder="1234567890" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FileUploadField label="Government ID" hint="PDF or image" />
                <FileUploadField label="Profile photo" hint="JPG or PNG" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="button" variant="ghost" onClick={skipMember} disabled={register.isPending} className="flex-1">
                  <SkipForward className="mr-2 h-4 w-4" /> Skip for now
                </Button>
                <Button type="button" onClick={() => onStep3Submit(demoFamilyStep3)} disabled={register.isPending} className="flex-1">
                  {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Finish
                </Button>
              </div>
            </div>
          )}
        </FormWrapper>
      )}
    </AuthLayout>
  );
};

export default FamilyRegisterPage;
