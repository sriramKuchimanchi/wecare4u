import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { Upload } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { FormWrapper, TextField, SelectField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

const lenientSchema = z.object({}).passthrough();

const serviceProviderTypeOptions = [
  { value: 'hospital', label: 'Hospital / Multi-Specialty Hospital' },
  { value: 'clinic', label: 'Medical Clinic / Polyclinic' },
  { value: 'individual-doctor', label: 'Individual Practitioner / Doctor' },
  { value: 'nursing-agency', label: 'Home Nursing / Caregiver Agency' },
  { value: 'pharmacy', label: 'Pharmacy / Chemist' },
  { value: 'diagnostic-lab', label: 'Diagnostic & Pathology Lab' },
  { value: 'ambulance', label: 'Ambulance & Emergency Response' },
  { value: 'home-services', label: 'Home & Medical Equipment Services' },
  { value: 'other', label: 'Other Service Provider' },
];

const FileUploadField = ({ label, hint }: { label: string; hint?: string }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:bg-primary/5 transition-all">
        <Upload className="h-4 w-4 text-primary" />
        <span className="truncate max-w-[200px]">{fileName ? fileName : 'Tap to upload'}</span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFileName(e.target.files[0].name);
            }
          }}
        />
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};

export const ProviderRegisterPage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(ROUTES.careProvider, { replace: true });
  };

  return (
    <AuthLayout
      title="Register as a Service Provider"
      subtitle="Complete your details to access your Service Provider portal."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </>
      }
    >
      <FormWrapper
        schema={lenientSchema as any}
        onSubmit={handleRedirect}
        defaultValues={{
          organizationName: '',
          organizationType: 'clinic',
          email: '',
          phone: '',
          registrationNumber: '',
          gst: '',
          website: '',
          primaryContactPerson: '',
          address: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
        }}
      >
        {() => (
          <div className="flex flex-col gap-4">
            <TextField name="organizationName" label="Provider / Business Name" placeholder="e.g. Aastha Care / Dr. Sharma Clinic" />
            <SelectField name="organizationType" label="Provider Category" options={serviceProviderTypeOptions} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField name="email" label="Email Address" type="email" placeholder="info@example.com" />
              <TextField name="phone" label="Phone Number" placeholder="+91 98200 12345" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField name="registrationNumber" label="Registration / License No." placeholder="REG-123456" />
              <TextField name="gst" label="GST / Tax ID" placeholder="27AAAAA0000A1Z5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField name="website" label="Website URL" placeholder="https://www.example.com" />
              <TextField name="primaryContactPerson" label="Primary Contact Person" placeholder="e.g. Dr. Rajesh Kumar" />
            </div>

            <TextField name="address" label="Street Address" placeholder="Building, Street, Landmark" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField name="city" label="City" placeholder="Mumbai" />
              <TextField name="district" label="District" placeholder="Suburban Mumbai" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField name="state" label="State" placeholder="Maharashtra" />
              <TextField name="pincode" label="Pincode" placeholder="400001" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <FileUploadField label="Registration / License Cert" hint="Official PDF or doc" />
              <FileUploadField label="GST Certificate / ID" hint="PDF or image" />
            </div>
            
            <FileUploadField label="Organization Logo / Photo" hint="PNG or JPG format" />

            <Button
              type="button"
              onClick={handleRedirect}
              className="w-full h-11 mt-2 text-base font-semibold"
            >
              Submit Registration
            </Button>
          </div>
        )}
      </FormWrapper>
    </AuthLayout>
  );
};

export default ProviderRegisterPage;
