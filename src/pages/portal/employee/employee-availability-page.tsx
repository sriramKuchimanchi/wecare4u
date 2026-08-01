import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEmployeeProfileQuery, useEmployeeStatusMutation } from '@/hooks/use-portal-queries';
import type { EmployeeAvailabilityStatus } from '@/types';

export const EmployeeAvailabilityPage = () => {
  const { toast } = useToast();
  const { data: employee, isLoading, refetch } = useEmployeeProfileQuery('emp_1');
  const statusMutation = useEmployeeStatusMutation();

  const [currentStatus, setCurrentStatus] = useState<EmployeeAvailabilityStatus>('available');

  if (isLoading || !employee) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleUpdate = async (status: EmployeeAvailabilityStatus) => {
    try {
      await statusMutation.mutateAsync({ employeeId: employee.id, status });
      setCurrentStatus(status);
      toast({ title: 'Availability Status Saved', description: `Your status is set to ${status.toUpperCase()}.` });
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Availability & Shift Status</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Toggle availability status for dispatchers</p>
      </div>

      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <icons.UserCheck className="h-5 w-5 text-primary" /> Select Active Duty Status
        </h2>

        <div className="space-y-2">
          {[
            { key: 'available', title: 'Available', desc: 'Ready to accept incoming field care visits' },
            { key: 'busy', title: 'Busy (On Visit)', desc: 'Currently attending to a patient visit' },
            { key: 'emergency_duty', title: 'Emergency Duty', desc: 'Available exclusively for 24/7 priority emergency dispatch' },
            { key: 'on_leave', title: 'On Leave', desc: 'Not available for dispatch today' },
            { key: 'offline', title: 'Offline', desc: 'Shift completed' },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleUpdate(item.key as EmployeeAvailabilityStatus)}
              className="cursor-pointer rounded-xl p-4 border flex items-center justify-between hover:border-primary/50 transition-all bg-muted/30"
            >
              <div>
                <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>

              {(employee.availability === item.key || currentStatus === item.key) && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                  <icons.Check className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
