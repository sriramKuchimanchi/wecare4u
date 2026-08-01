import { useState, useEffect } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Employee, EmployeeAvailabilityStatus, GovernmentIdType } from '@/types';

type EmployeeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: Partial<Employee>) => Promise<void>;
  initialData?: Employee | null;
  isLoading?: boolean;
};

export const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: EmployeeFormModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: '',
    department: 'Home Care Services',
    experience: '3 years',
    licenseNumber: '',
    contact: { phone: '', email: '' },
    address: { line1: '', city: 'Dubai', state: 'Dubai', postalCode: '00000', country: 'UAE' },
    languages: ['Arabic', 'English'],
    availability: 'available' as EmployeeAvailabilityStatus,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '08:00 AM - 05:00 PM',
    governmentIdType: 'national-id' as GovernmentIdType,
    governmentIdNumber: '',
    certificates: ['BLS Certified', 'DHA License'],
    emergencyContact: { name: '', relationship: '', phone: '' },
    status: 'active',
    avatarUrl: '',
    specialization: ['Geriatric Care'],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        name: '',
        role: '',
        department: 'Home Care Services',
        experience: '3 years',
        licenseNumber: '',
        contact: { phone: '', email: '' },
        address: { line1: '', city: 'Dubai', state: 'Dubai', postalCode: '00000', country: 'UAE' },
        languages: ['Arabic', 'English'],
        availability: 'available',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: '08:00 AM - 05:00 PM',
        governmentIdType: 'national-id',
        governmentIdNumber: '',
        certificates: ['BLS Certified', 'DHA License'],
        emergencyContact: { name: '', relationship: '', phone: '' },
        status: 'active',
        avatarUrl: '',
        specialization: ['Geriatric Care'],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.contact?.phone) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in mandatory fields (Full Name, Role, Phone Number).',
        variant: 'destructive',
      });
      return;
    }
    try {
      await onSubmit(formData);
      toast({
        title: initialData ? 'Employee Updated' : 'Employee Added',
        description: `${formData.name} has been successfully saved to your organization staff roster.`,
      });
      onClose();
    } catch {
      toast({
        title: 'Operation Failed',
        description: 'An error occurred while saving employee data.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <icons.UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {initialData ? 'Edit Employee Profile' : 'Add New Employee'}
              </h2>
              <p className="text-xs text-muted-foreground">Fill in professional credentials & emergency contacts</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <icons.X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">1. Personal & Role Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Full Name *</label>
                <Input
                  placeholder="e.g. Layla Al-Nasser"
                  value={formData.name || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Role / Designation *</label>
                <Input
                  placeholder="e.g. Registered Nurse"
                  value={formData.role || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Department</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.department || 'Home Care Services'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                >
                  <option value="Home Care Services">Home Care Services</option>
                  <option value="Home Nursing">Home Nursing</option>
                  <option value="Medical Services">Medical Services</option>
                  <option value="Rehabilitation">Rehabilitation</option>
                  <option value="Ambulance & Emergency">Ambulance & Emergency</option>
                  <option value="Home Maintenance">Home Maintenance</option>
                  <option value="Pharmacy & Lab">Pharmacy & Lab</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Experience Years</label>
                <Input
                  placeholder="e.g. 5 years"
                  value={formData.experience || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">License Number</label>
                <Input
                  placeholder="e.g. DHA-RN-88219"
                  value={formData.licenseNumber || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Profile Photo URL (Mock)</label>
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">2. Contact & Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Phone Number *</label>
                <Input
                  placeholder="+971 50 123 4567"
                  value={formData.contact?.phone || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contact: { ...prev.contact!, phone: e.target.value } }))
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="employee@sunrise.ae"
                  value={formData.contact?.email || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contact: { ...prev.contact!, email: e.target.value } }))
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-foreground mb-1 block">Residential Address</label>
                <Input
                  placeholder="Street, District, City"
                  value={formData.address?.line1 || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: { ...prev.address!, line1: e.target.value } }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Professional Credentials & Availability */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              3. Availability & Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Current Availability Status</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.availability || 'available'}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, availability: e.target.value as EmployeeAvailabilityStatus }))
                  }
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy (On Visit)</option>
                  <option value="offline">Offline</option>
                  <option value="on_leave">On Leave</option>
                  <option value="emergency_duty">Emergency Duty</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Working Hours</label>
                <Input
                  placeholder="08:00 AM - 05:00 PM"
                  value={formData.workingHours || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, workingHours: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Government ID Type</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.governmentIdType || 'national-id'}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, governmentIdType: e.target.value as GovernmentIdType }))
                  }
                >
                  <option value="national-id">Emirates ID / National ID</option>
                  <option value="passport">Passport</option>
                  <option value="driving-license">Driving License</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Government ID Number</label>
                <Input
                  placeholder="784-1988-1234567-1"
                  value={formData.governmentIdNumber || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, governmentIdNumber: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">4. Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Contact Person Name</label>
                <Input
                  placeholder="e.g. Sami Al-Nasser"
                  value={formData.emergencyContact?.name || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact!, name: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Relationship</label>
                <Input
                  placeholder="e.g. Brother"
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact!, relationship: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Emergency Phone</label>
                <Input
                  placeholder="+971 50 999 8877"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact!, phone: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <icons.Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Employee Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
