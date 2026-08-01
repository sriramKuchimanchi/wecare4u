import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import {
  useEmployeeDashboardQuery,
  useEmployeeStatusMutation,
  useEmployeeWorkflowMutation,
} from '@/hooks/use-portal-queries';
import { cn } from '@/lib/utils';
import type { EmployeeAvailabilityStatus } from '@/types';

export const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const employeeId = user?.id ?? 'emp_1';

  const { data: dashboard, isLoading, refetch } = useEmployeeDashboardQuery(employeeId);
  const statusMutation = useEmployeeStatusMutation();
  const workflowMutation = useEmployeeWorkflowMutation();

  const [statusSelectorOpen, setStatusSelectorOpen] = useState(false);

  if (isLoading || !dashboard) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { employee, todaySchedule, assignedRequests, notifications } = dashboard;

  const handleStatusChange = async (newStatus: EmployeeAvailabilityStatus) => {
    try {
      await statusMutation.mutateAsync({ employeeId: employee.id, status: newStatus });
      toast({ title: 'Status Updated', description: `Your status is now ${newStatus.replace('_', ' ').toUpperCase()}.` });
      setStatusSelectorOpen(false);
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  };

  const getAvailBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500 text-white';
      case 'busy':
        return 'bg-amber-500 text-white';
      case 'emergency_duty':
        return 'bg-red-600 text-white animate-pulse';
      case 'on_leave':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Field Staff Header & Status Selector */}
      <div className="rounded-2xl bg-gradient-to-r from-primary via-primary to-primary-hover p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={employee.avatarUrl || 'https://images.unsplash.com/photo-1594824813566-7885a3964478?auto=format&fit=crop&q=80&w=200'}
              alt={employee.name}
              className="h-14 w-14 rounded-2xl object-cover border-2 border-white/30 shadow-sm"
            />
            <div>
              <h1 className="text-xl font-bold">{employee.name}</h1>
              <p className="text-xs text-primary-foreground/90">{employee.role} • {employee.department}</p>
            </div>
          </div>

          {/* Availability Status Badge & Toggle */}
          <div className="relative">
            <button
              onClick={() => setStatusSelectorOpen(!statusSelectorOpen)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-md transition-all',
                getAvailBadgeClass(employee.availability)
              )}
            >
              <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              <span>STATUS: {employee.availability.replace('_', ' ').toUpperCase()}</span>
              <icons.ChevronDown className="h-4 w-4" />
            </button>

            {statusSelectorOpen && (
              <div className="absolute right-0 mt-2 z-20 w-48 rounded-xl bg-surface p-2 shadow-2xl border text-foreground space-y-1">
                {[
                  { key: 'available', label: 'Available (Ready)' },
                  { key: 'busy', label: 'Busy (On Visit)' },
                  { key: 'emergency_duty', label: 'Emergency Duty' },
                  { key: 'on_leave', label: 'On Leave' },
                  { key: 'offline', label: 'Offline' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleStatusChange(item.key as EmployeeAvailabilityStatus)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    {employee.availability === item.key && <icons.Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-center text-xs">
          <div>
            <span className="text-2xs text-primary-foreground/80">Today's Visits</span>
            <p className="text-lg font-bold">{todaySchedule.length}</p>
          </div>
          <div>
            <span className="text-2xs text-primary-foreground/80">Pending Action</span>
            <p className="text-lg font-bold">{assignedRequests.filter((r) => r.status === 'accepted' || r.status === 'employee_assigned').length}</p>
          </div>
          <div>
            <span className="text-2xs text-primary-foreground/80">Rating</span>
            <p className="text-lg font-bold flex items-center justify-center gap-1">
              <icons.Star className="h-3.5 w-3.5 fill-current text-secondary" /> {employee.rating ?? 4.9}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/portal/employee/requests')}
          className="rounded-2xl bg-surface p-4 border border-border/60 shadow-xs hover:border-primary transition-all text-left space-y-2 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <icons.ListChecks className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">Assigned Visits</h3>
            <p className="text-2xs text-muted-foreground">{assignedRequests.length} active jobs</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/portal/employee/schedule')}
          className="rounded-2xl bg-surface p-4 border border-border/60 shadow-xs hover:border-primary transition-all text-left space-y-2 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
            <icons.CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">My Schedule</h3>
            <p className="text-2xs text-muted-foreground">Shift & travel slots</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/portal/employee/availability')}
          className="rounded-2xl bg-surface p-4 border border-border/60 shadow-xs hover:border-primary transition-all text-left space-y-2 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <icons.UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">Availability</h3>
            <p className="text-2xs text-muted-foreground">Manage shifts</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/portal/employee/search')}
          className="rounded-2xl bg-surface p-4 border border-border/60 shadow-xs hover:border-primary transition-all text-left space-y-2 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <icons.Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">Field Search</h3>
            <p className="text-2xs text-muted-foreground">Patients & care notes</p>
          </div>
        </button>
      </div>

      {/* Today's Schedule & Visits List */}
      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <icons.Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Today's Field Schedule</h2>
              <p className="text-xs text-muted-foreground">Sequential patient visits for today</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/portal/employee/requests')}>
            View All Jobs
          </Button>
        </div>

        {todaySchedule.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No care visits scheduled for today.</p>
        ) : (
          <div className="space-y-4">
            {todaySchedule.map((req) => (
              <div
                key={req.id}
                className="rounded-xl bg-muted/30 p-5 border border-border/60 space-y-3 hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{req.patientName || 'Madhav Rao'}</h3>
                      <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {req.categoryLabel || req.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{req.familyName || 'Family Request'}</p>
                  </div>

                  <span className="text-xs font-bold capitalize px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 w-fit">
                    {req.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <icons.MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{req.address?.line1 || 'Marina Heights, Dubai'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <icons.Clock className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground font-medium">
                      {new Date(req.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t pt-3">
                  <Button size="sm" onClick={() => navigate(`/portal/employee/requests/${req.id}`)} className="w-full sm:w-auto gap-1.5">
                    Open Field Console <icons.ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications Feed */}
      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <icons.Bell className="h-5 w-5 text-primary" /> Shift Reminders & Notifications
        </h2>

        <div className="divide-y divide-border/60">
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className="py-3 flex items-start gap-3 text-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                <icons.Info className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{n.title}</h4>
                <p className="text-muted-foreground mt-0.5">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
