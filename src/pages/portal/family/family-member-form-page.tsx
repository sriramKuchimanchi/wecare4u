import { useNavigate, useParams } from 'react-router-dom';
import { FormWrapper, TextField, SelectField, TextAreaField } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Upload } from '@/config/icons';
import { useFamilyMember, useAddMemberMutation, useUpdateMemberMutation } from '@/hooks/use-family-portal';
import { useToast } from '@/hooks/use-toast';
import type { FamilyMember, Gender, BloodGroup, GovernmentIdType } from '@/types';

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
const govIdOptions: { value: GovernmentIdType; label: string }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'national-id', label: 'National ID' },
  { value: 'driving-license', label: 'Driving License' },
  { value: 'aadhaar', label: 'Aadhaar' },
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

export const FamilyMemberFormPage = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const isEdit = Boolean(memberId && memberId !== 'new');
  const { data: existing } = useFamilyMember(isEdit ? memberId! : '');
  const addMember = useAddMemberMutation();
  const updateMember = useUpdateMemberMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (values: Record<string, any>) => {
    const payload: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt' | 'familyId'> = {
      name: values.name,
      relationship: values.relationship,
      gender: values.gender as Gender,
      dateOfBirth: values.dateOfBirth,
      bloodGroup: values.bloodGroup as BloodGroup,
      medicalConditions: values.medicalConditions ? values.medicalConditions.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      allergies: values.allergies ? values.allergies.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      insurance: values.insuranceProvider ? { provider: values.insuranceProvider, policyNumber: values.policyNumber } : undefined,
      emergencyContacts: values.emergencyContactName ? [{ name: values.emergencyContactName, relationship: values.emergencyContactRelationship, phone: values.emergencyContactPhone, isPrimary: true }] : [],
      governmentIdType: values.governmentIdType as GovernmentIdType,
      governmentIdNumber: values.governmentIdNumber,
      medicalNotes: values.medicalNotes,
      status: 'active',
    };

    if (isEdit && memberId) {
      await updateMember.mutateAsync({ id: memberId, patch: payload });
      navigate(`/portal/family/members/${memberId}`);
    } else {
      await addMember.mutateAsync(payload);
      navigate('/portal/family/members');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {isEdit ? 'Edit Family Member' : 'Add Family Member'}
        </h1>
        <p className="text-sm text-muted-foreground">Complete the profile so we can coordinate the right care.</p>
      </div>

      <FormWrapper
        schema={{
          parse: (v: any) => v,
          safeParse: (v: any) => ({ success: true, data: v }),
        } as any}
        onSubmit={handleSubmit}
        defaultValues={{
          name: existing?.name ?? '',
          relationship: existing?.relationship ?? '',
          gender: existing?.gender ?? 'male',
          dateOfBirth: existing?.dateOfBirth ?? '',
          bloodGroup: existing?.bloodGroup ?? '',
          medicalConditions: existing?.medicalConditions?.join(', ') ?? '',
          allergies: existing?.allergies?.join(', ') ?? '',
          insuranceProvider: existing?.insurance?.provider ?? '',
          policyNumber: existing?.insurance?.policyNumber ?? '',
          emergencyContactName: existing?.emergencyContacts?.[0]?.name ?? '',
          emergencyContactRelationship: existing?.emergencyContacts?.[0]?.relationship ?? '',
          emergencyContactPhone: existing?.emergencyContacts?.[0]?.phone ?? '',
          governmentIdType: existing?.governmentIdType ?? 'passport',
          governmentIdNumber: existing?.governmentIdNumber ?? '',
          medicalNotes: existing?.medicalNotes ?? '',
        }}
      >
        {() => (
          <div className="flex flex-col gap-6">
            {/* Profile Photo */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Profile Photo</h2>
              <FileUploadField label="Profile photo" hint="JPG or PNG" />
            </section>

            {/* Personal Information */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="name" label="Full name" required placeholder="Mohammed Rahman" />
                <TextField name="relationship" label="Relationship" required placeholder="Father" />
                <SelectField name="gender" label="Gender" required options={genderOptions} />
                <TextField name="dateOfBirth" label="Date of birth" type="date" required />
                <SelectField name="bloodGroup" label="Blood group" required options={bloodGroups.map((b) => ({ value: b, label: b }))} />
              </div>
            </section>

            {/* Medical Information */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Medical Information</h2>
              <div className="grid gap-4">
                <TextField name="medicalConditions" label="Medical conditions" placeholder="Hypertension, diabetes (comma-separated)" />
                <TextField name="allergies" label="Allergies" placeholder="Penicillin, peanuts (comma-separated)" />
                <TextAreaField name="medicalNotes" label="Medical notes" placeholder="Any additional notes for care providers…" rows={3} />
              </div>
            </section>

            {/* Insurance */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Insurance</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="insuranceProvider" label="Insurance provider" placeholder="Daman Health" />
                <TextField name="policyNumber" label="Policy number" placeholder="DH-12345678" />
              </div>
            </section>

            {/* Emergency Contacts */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Emergency Contacts</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField name="emergencyContactName" label="Contact name" placeholder="Aisha Rahman" />
                <TextField name="emergencyContactRelationship" label="Relationship" placeholder="Daughter" />
                <TextField name="emergencyContactPhone" label="Phone" placeholder="+971 50 123 4567" />
              </div>
            </section>

            {/* Government ID */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Government ID</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField name="governmentIdType" label="ID type" required options={govIdOptions} />
                <TextField name="governmentIdNumber" label="ID number" required placeholder="A12345678" />
              </div>
              <FileUploadField label="Government ID document" hint="PDF or image" />
            </section>

            {/* Emergency Preferences */}
            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">Emergency Preferences</h2>
              <TextAreaField name="emergencyPreferences" label="Emergency care preferences" placeholder="Any preferences for emergency responders to know…" rows={3} />
            </section>

            {/* Actions */}
            <div className="flex gap-3 border-t border-border pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={addMember.isPending || updateMember.isPending}>
                {(addMember.isPending || updateMember.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Save changes' : 'Save member'}
              </Button>
            </div>
          </div>
        )}
      </FormWrapper>
    </div>
  );
};

export default FamilyMemberFormPage;
