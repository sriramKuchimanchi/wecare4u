import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  useProviderEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useToggleEmployeeStatusMutation,
} from '@/hooks/use-portal-queries';
import { EmployeeFormModal } from './employee-form-modal';
import type { Employee } from '@/types';
import { cn } from '@/lib/utils';

import { AppAvatar } from '@/components/shared';

export const EmployeeManagementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availFilter, setAvailFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const { data: employees = [], isLoading, refetch } = useProviderEmployeesQuery({
    search,
    status: statusFilter,
    availability: availFilter,
    department: deptFilter,
  });

  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const toggleMutation = useToggleEmployeeStatusMutation();

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData: Partial<Employee>) => {
    if (editingEmployee) {
      await updateMutation.mutateAsync({ id: editingEmployee.id, patch: formData });
    } else {
      await createMutation.mutateAsync(formData as Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>);
    }
    refetch();
  };

  const handleToggleStatus = async (emp: Employee) => {
    try {
      await toggleMutation.mutateAsync(emp.id);
      toast({
        title: emp.status === 'active' ? 'Employee Deactivated' : 'Employee Activated',
        description: `${emp.name} is now ${emp.status === 'active' ? 'inactive' : 'active'}.`,
      });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to update employee status.', variant: 'destructive' });
    }
  };

  const getAvailBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'busy':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'emergency_duty':
        return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'on_leave':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage caregivers, nurses, doctors and support staff</p>
        </div>

        <Button onClick={handleOpenAddModal} className="gap-2 shadow-sm">
          <icons.UserPlus className="h-4 w-4" /> Add New Employee
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 rounded-2xl bg-surface p-4 border border-border/60 shadow-xs">
        <div className="relative">
          <icons.Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, role, license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <select
          value={availFilter}
          onChange={(e) => setAvailFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy (On Duty)</option>
          <option value="emergency_duty">Emergency Duty</option>
          <option value="on_leave">On Leave</option>
          <option value="offline">Offline</option>
        </select>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Departments</option>
          <option value="Home Nursing">Home Nursing</option>
          <option value="Home Care Services">Home Care Services</option>
          <option value="Medical Services">Medical Services</option>
          <option value="Rehabilitation">Rehabilitation</option>
          <option value="Ambulance & Emergency">Ambulance & Emergency</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Account Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive / Deactivated</option>
        </select>
      </div>

      {/* Employee Roster Cards Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-2xl bg-surface p-12 text-center border border-border/60">
          <icons.Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-base font-bold text-foreground mt-3">No Employees Found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting search filters or add a new staff member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="rounded-2xl bg-surface p-5 border border-border/60 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Employee Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <AppAvatar
                      src={emp.avatarUrl}
                      name={emp.name}
                      className="h-12 w-12 rounded-xl border border-primary/20"
                    />
                    <div>
                      <h3 className="text-base font-bold text-foreground">{emp.name}</h3>
                      <p className="text-xs font-semibold text-primary">{emp.role}</p>
                      <span className="text-2xs text-muted-foreground">{emp.department || 'Care Services'}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase border capitalize',
                      getAvailBadge(emp.availability)
                    )}
                  >
                    {emp.availability.replace('_', ' ')}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span>License #:</span>
                    <span className="font-semibold text-foreground">{emp.licenseNumber || 'DHA-RN-000'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Experience:</span>
                    <span className="font-semibold text-foreground">{emp.experience || '3 years'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phone Contact:</span>
                    <span className="font-semibold text-foreground">{emp.contact?.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rating Score:</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <icons.Star className="h-3.5 w-3.5 fill-current" /> {emp.rating ?? 4.8} ({emp.reviewCount ?? 12})
                    </span>
                  </div>
                </div>

                {/* Account Status Badge */}
                <div className="flex items-center justify-between pt-1 text-2xs">
                  <span className="text-muted-foreground">Account Status:</span>
                  <span
                    className={cn(
                      'font-bold px-2 py-0.5 rounded-md',
                      emp.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                    )}
                  >
                    {emp.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/portal/care-provider/employees/${emp.id}`)}
                >
                  <icons.Eye className="mr-1 h-3.5 w-3.5" /> Profile
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleOpenEditModal(emp)}>
                  <icons.Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn('text-xs', emp.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50')}
                  onClick={() => handleToggleStatus(emp)}
                >
                  {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingEmployee}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
