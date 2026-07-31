import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, ArrowRight, User, Building2, Upload, CheckCircle } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { FormWrapper, TextField, SelectField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  providerIndividualSchema, providerOrganizationSchema,
  type ProviderIndividualInput, type ProviderOrganizationInput,
} from '@/lib/schemas';
import { useRegisterProviderMutation } from '@/hooks/use-auth-mutations';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const categoryOptions = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'caregiver', label: 'Caregiver' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'lab-technician', label: 'Lab Technician' },
  { value: 'pharmacist', label: 'Pharmacist' },
];

const organizationTypeOptions = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'diagnostic-lab', label: 'Diagnostic Lab' },
  { value: 'ambulance', label: 'Ambulance' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'home-care', label: 'Home Care' },
  { value: 'home-nursing', label: 'Home Nursing' },
  { value: 'other', label: 'Other' },
];

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

export const ProviderRegisterPage = () => {
  const [type, setType] = useState<'individual' | 'organization' | null>(null);
  const [submitted, setSubmitted] = useState<{ referenceId: string } | null>(null);
  const register = useRegisterProviderMutation();
  const navigate = useNavigate();

  const onIndividualSubmit = async (values: ProviderIndividualInput) => {
    const result = await register.mutateAsync({
      type: 'individual',
      category: values.category,
      name: values.businessName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      experience: values.experience,
      licenseNumber: values.licenseNumber,
    });
    if (result.success && result.data) setSubmitted({ referenceId: result.data.referenceId });
  };

  const onOrganizationSubmit = async (values: ProviderOrganizationInput) => {
    const result = await register.mutateAsync({
      type: 'organization',
      organizationType: values.organizationType,
      name: values.organizationName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      district: values.district,
      state: values.state,
      pincode: values.pincode,
      registrationNumber: values.registrationNumber,
      gst: values.gst,
      website: values.website,
      primaryContactPerson: values.primaryContactPerson,
    });
    if (result.success && result.data) setSubmitted({ referenceId: result.data.referenceId });
  };

  if (submitted) {
    return (
      <AuthLayout title="Registration submitted">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 text-warning">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-foreground">Pending Verification</h2>
            <p className="text-sm text-muted-foreground">
              Your registration has been received. Your account will become active after admin verification.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm">
            Reference ID: <span className="font-mono font-semibold text-foreground">{submitted.referenceId}</span>
          </div>
          <Button onClick={() => navigate(ROUTES.login)} className="w-full">Return to Login</Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Register as a Care Provider"
      subtitle="Join the platform to offer your care services."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </>
      }
    >
      {!type ? (
        <div className="flex flex-col gap-3">
          {[
            { key: 'individual' as const, title: 'Individual Professional', description: 'Doctors, nurses, caregivers, technicians and more.', icon: User },
            { key: 'organization' as const, title: 'Organization', description: 'Hospitals, clinics, pharmacies, labs and agencies.', icon: Building2 },
          ].map((choice) => (
            <button
              key={choice.key}
              type="button"
              onClick={() => setType(choice.key)}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-primary hover:shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <choice.icon className="h-5 w-5" />
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold text-foreground">{choice.title}</span>
                <span className="text-xs text-muted-foreground">{choice.description}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      ) : type === 'individual' ? (
        <FormWrapper schema={providerIndividualSchema} onSubmit={onIndividualSubmit} defaultValues={{ businessName: '', category: 'doctor', phone: '', email: '', address: '', experience: '', licenseNumber: '' }}>
          {() => (
            <div className="flex flex-col gap-4">
              <TextField name="businessName" label="Business name" required placeholder="Dr. Omar Clinic" />
              <SelectField name="category" label="Professional category" required options={categoryOptions} />
              <div className="grid grid-cols-2 gap-3">
                <TextField name="phone" label="Phone" required placeholder="+971 50 123 4567" />
                <TextField name="email" label="Email" type="email" required placeholder="you@example.com" />
              </div>
              <TextField name="address" label="Address" required placeholder="Street, city" />
              <div className="grid grid-cols-2 gap-3">
                <TextField name="experience" label="Experience (years)" required placeholder="10" />
                <TextField name="licenseNumber" label="License number" required placeholder="LIC-12345" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FileUploadField label="Government ID" hint="PDF or image" />
                <FileUploadField label="Certificates" hint="PDF or image" />
              </div>
              <FileUploadField label="Profile photo" hint="JPG or PNG" />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setType(null)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" disabled={register.isPending} className="flex-1">
                  {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit
                </Button>
              </div>
            </div>
          )}
        </FormWrapper>
      ) : (
        <FormWrapper schema={providerOrganizationSchema} onSubmit={onOrganizationSubmit} defaultValues={{ organizationName: '', organizationType: 'hospital', registrationNumber: '', gst: '', website: '', email: '', phone: '', address: '', city: '', district: '', state: '', pincode: '', primaryContactPerson: '' }}>
          {() => (
            <div className="flex flex-col gap-4">
              <TextField name="organizationName" label="Organization name" required placeholder="Sunrise Hospital" />
              <SelectField name="organizationType" label="Organization type" required options={organizationTypeOptions} />
              <div className="grid grid-cols-2 gap-3">
                <TextField name="registrationNumber" label="Registration number" required placeholder="REG-12345" />
                <TextField name="gst" label="GST" required placeholder="12ABCDE1234F1Z5" />
              </div>
              <TextField name="website" label="Website" placeholder="https://example.com" />
              <div className="grid grid-cols-2 gap-3">
                <TextField name="email" label="Email" type="email" required placeholder="info@example.com" />
                <TextField name="phone" label="Phone" required placeholder="+971 50 123 4567" />
              </div>
              <TextField name="address" label="Address" required placeholder="Street, building" />
              <div className="grid grid-cols-2 gap-3">
                <TextField name="city" label="City" required placeholder="Dubai" />
                <TextField name="district" label="District" required placeholder="Dubai Marina" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField name="state" label="State" required placeholder="Dubai" />
                <TextField name="pincode" label="Pincode" required placeholder="00000" />
              </div>
              <TextField name="primaryContactPerson" label="Primary contact person" required placeholder="Aisha Rahman" />
              <div className="grid grid-cols-2 gap-3">
                <FileUploadField label="Registration certificate" hint="PDF" />
                <FileUploadField label="GST certificate" hint="PDF" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FileUploadField label="License" hint="PDF" />
                <FileUploadField label="Logo" hint="PNG/JPG" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setType(null)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" disabled={register.isPending} className="flex-1">
                  {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit
                </Button>
              </div>
            </div>
          )}
        </FormWrapper>
      )}
    </AuthLayout>
  );
};

export default ProviderRegisterPage;
