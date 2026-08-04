import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { Upload, CheckSquare, Square } from '@/config/icons';
import { AuthLayout } from '@/layouts';
import { FormWrapper, TextField, LocationPermissionDialog } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useAdminCategoriesQuery } from '@/hooks/use-portal-queries';
import { cn } from '@/lib/utils';

const lenientSchema = z.object({}).passthrough();

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
  const { data: adminCategories, isLoading: categoriesLoading } = useAdminCategoriesQuery();
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // Build grouped sub-categories from categories
  const categoriesGrouped: { categoryName: string; items: { id: string; name: string }[] }[] = [];

  if (adminCategories && adminCategories.length > 0) {
    adminCategories.forEach((cat: any) => {
      if (cat.enabled !== false) {
        const subItems: { id: string; name: string }[] = [];
        if (cat.items && cat.items.length > 0) {
          cat.items.forEach((item: any, idx: number) => {
            const itemName = typeof item === 'string' ? item : item.name;
            subItems.push({
              id: `${cat.id}_sub_${idx}`,
              name: itemName,
            });
          });
        } else {
          subItems.push({
            id: cat.id,
            name: cat.name,
          });
        }
        if (subItems.length > 0) {
          categoriesGrouped.push({
            categoryName: cat.name,
            items: subItems,
          });
        }
      }
    });
  }

  const toggleSubCategory = (name: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleRedirect = () => {
    // Persist selected sub-categories so the provider dashboard can use them
    try {
      localStorage.setItem('provider_registered_services', JSON.stringify(selectedSubCategories));
    } catch {
      // ignore
    }
    setShowLocationPrompt(true);
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
          <div className="flex flex-col gap-5">
            <TextField name="organizationName" label="Provider / Business Name" placeholder="e.g. Aastha Care / Dr. Sharma Clinic" />

            {/* Provider Sub-Categories — dynamic checkbox list grouped by category */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Services Offered <span className="text-xs font-normal text-muted-foreground">(select sub-categories that apply)</span>
                </label>
                {selectedSubCategories.length > 0 && (
                  <p className="text-xs text-primary font-bold mt-0.5">
                    {selectedSubCategories.length} sub-category service{selectedSubCategories.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {categoriesLoading ? (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-9 animate-pulse rounded-lg bg-muted/40" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {categoriesGrouped.map((group) => (
                    <div key={group.categoryName} className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/10 p-3">
                      <span className="text-2xs font-bold uppercase tracking-wider text-primary">
                        {group.categoryName}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                        {group.items.map((sub) => {
                          const isSelected = selectedSubCategories.includes(sub.name);
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => toggleSubCategory(sub.name)}
                              className={cn(
                                'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all',
                                isSelected
                                  ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                                  : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5'
                              )}
                            >
                              {isSelected
                                ? <CheckSquare className="h-4 w-4 shrink-0 text-primary" />
                                : <Square className="h-4 w-4 shrink-0 text-muted-foreground" />
                              }
                              <span className="truncate">{sub.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

      <LocationPermissionDialog
        open={showLocationPrompt}
        onDone={() => navigate(ROUTES.careProvider, { replace: true })}
      />
    </AuthLayout>
  );
};

export default ProviderRegisterPage;
