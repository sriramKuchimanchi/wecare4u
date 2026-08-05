import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  useProviderRequestsQuery,
  useAcceptRequestMutation,
  useRejectRequestMutation,
} from '@/hooks/use-portal-queries';
import { cn } from '@/lib/utils';
import type { CareRequestStatus } from '@/types';

export const CareRequestsListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const STATUS_TABS: { value: string; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'requested', label: 'Requested' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'on_the_way', label: 'On The Way' },
    { value: 'arrived', label: 'Arrived' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const { data: requests = [], isLoading } = useProviderRequestsQuery({
    search,
    status: statusFilter,
    priority: priorityFilter,
  });

  const acceptMutation = useAcceptRequestMutation();
  const rejectMutation = useRejectRequestMutation();

  const handleAccept = async (id: string) => {
    try {
      await acceptMutation.mutateAsync(id);
      toast({ title: 'Booking Accepted', description: 'Care booking accepted. Track its progress from the booking details.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to accept request.', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync({ id, reason: 'Staff unavailable' });
      toast({ title: 'Booking Declined', description: 'Care booking declined.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to decline request.', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: CareRequestStatus) => {
    switch (status) {
      case 'requested':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'accepted':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'on_the_way':
        return 'bg-sky-500/10 text-sky-600 border-sky-500/30';
      case 'arrived':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'in_progress':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'completed':
        return 'bg-gray-500/10 text-gray-700 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Bookings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage incoming family bookings and their live progress</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 border border-border/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <icons.Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patient, family or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex-shrink-0">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Priorities</option>
              <option value="emergency">Emergency</option>
              {/* <option value="urgent">Urgent</option> */}
              <option value="standard">Standard</option>
              {/* <option value="scheduled">Scheduled</option> */}
            </select>
          </div>
        </div>

      </div>
        <div>
          <div className="flex items-center gap-3 overflow-x-auto border-b border-border/60 pb-3">
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={cn(
                    'flex-shrink-0 text-sm font-medium transition-colors select-none whitespace-nowrap',
                    active
                      ? 'bg-primary text-white px-3 py-1 rounded-md shadow-sm'
                      : 'text-muted-foreground px-2 py-1 hover:text-primary'
                  )}
                  aria-pressed={active}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

      {/* Request Cards / Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl bg-surface p-12 text-center border border-border/60">
          <icons.ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-base font-bold text-foreground mt-3">No Service Bookings Found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try resetting your search or status filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl bg-surface p-5 border border-border/60 shadow-xs hover:border-primary/40 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {req.patientName ? req.patientName.charAt(0) : 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">
                        {req.patientName || 'Madhav Rao'}
                      </h3>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {req.familyName || 'Family Booking'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Service: <span className="font-semibold text-foreground">{req.categoryLabel || req.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.priority === 'emergency' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-2xs font-black uppercase text-red-600 border border-red-500/30 animate-pulse">
                      <icons.AlertCircle className="h-3 w-3" /> Emergency
                    </span>
                  )}
                  {req.priority === 'urgent' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-2xs font-black uppercase text-amber-600 border border-amber-500/30">
                      <icons.Clock className="h-3 w-3" /> Urgent
                    </span>
                  )}

                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize border',
                      getStatusBadge(req.status)
                    )}
                  >
                    {req.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Request Metadata Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-2xs font-medium">Location</span>
                  <div className="flex items-center gap-1 font-medium text-foreground mt-0.5 truncate">
                    <icons.MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{req.address?.line1 || 'Marina Heights, Dubai'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-2xs font-medium">Requested Time</span>
                  <div className="flex items-center gap-1 font-medium text-foreground mt-0.5">
                    <icons.CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{new Date(req.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-2xs font-medium">Estimated Cost</span>
                  <div className="flex items-center gap-1 font-bold text-foreground mt-0.5">
                    <span>₹{req.estimatedCost || 1500}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/portal/care-provider/bookings/${req.id}`)}
                >
                  <icons.Eye className="mr-1.5 h-3.5 w-3.5" /> View Details
                </Button>

                {req.status === 'requested' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(req.id)}
                    >
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleAccept(req.id)}>
                      <icons.Check className="mr-1.5 h-3.5 w-3.5" /> Accept Booking
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareRequestsListPage;
