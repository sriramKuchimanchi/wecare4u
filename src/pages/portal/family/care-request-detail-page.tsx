import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Phone, Clock, UserCheck, XCircle, CheckCircle2, MessageSquare, AlertCircle,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/shared/skeleton';
import { CareRequestStatusStepper, statusSteps } from '@/components/care-coordination/CareRequestStatusStepper';
import { LiveMapPlaceholder } from '@/components/care-coordination/LiveMapPlaceholder';
import careRequestService from '@/services/care-request.service';
import { useCareRequestStore, useNotificationStore, useTimelineStore } from '@/store';
import { formatDate, formatTime, formatRelative } from '@/utils/date';
import type { CareRequest, CareRequestStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const CareRequestDetailPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [request, setRequest] = useState<CareRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const addNotification = useNotificationStore((s) => s.addNotification);
  const addTimelineEntry = useTimelineStore((s) => s.addEntry);
  const updateRequestStatusStore = useCareRequestStore((s) => s.updateRequestStatus);

  useEffect(() => {
    if (!requestId) return;
    setIsLoading(true);
    careRequestService.get(requestId).then((res) => {
      if (res.success && res.data) setRequest(res.data);
      setIsLoading(false);
    });
  }, [requestId]);

  const handleAdvanceStatus = async (nextStatus: CareRequestStatus) => {
    if (!request) return;
    const now = new Date().toISOString();
    const res = await careRequestService.updateStatus(request.id, nextStatus);

    if (res.success && res.data) {
      setRequest(res.data);
      updateRequestStatusStore(request.id, nextStatus);

      addNotification({
        id: `notif_st_${Date.now()}`,
        userId: 'user_family_1',
        title: `Care Request Status Updated`,
        message: `Request for ${request.categoryLabel || request.category} is now "${nextStatus.replace('_', ' ')}".`,
        read: false,
        type: nextStatus === 'completed' ? 'success' : nextStatus === 'cancelled' ? 'error' : 'info',
        createdAt: now,
        updatedAt: now,
      });

      addTimelineEntry({
        id: `tl_st_${Date.now()}`,
        familyId: request.familyId,
        memberId: request.memberId,
        eventType: `care-request-${nextStatus}`,
        title: `Care Request Status: ${nextStatus.replace('_', ' ').toUpperCase()}`,
        description: `Provider: ${request.providerName} · Member: ${request.memberName || 'Family Member'}`,
        createdAt: now,
        updatedAt: now,
      });

      toast({ title: 'Status updated', description: `Request status set to ${nextStatus.replace('_', ' ')}.` });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-36" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!request) {
    return (
      <Card>
        <EmptyState
          icon={AlertCircle}
          title="Request Not Found"
          description="The requested care request details could not be found."
          action={<Button onClick={() => navigate('/portal/family/request-care')}>Back to Request Care</Button>}
        />
      </Card>
    );
  }

  const isTrackingActive = ['on_the_way', 'arrived', 'in_progress'].includes(request.status);

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Requests
      </Button>

      {/* Header Info Card */}
      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center justify-between border-border bg-card shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Care Request #{request.id.slice(-6)}</span>
            <Badge variant="outline" className="text-xs font-bold capitalize">
              {request.categoryLabel || request.category}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{request.providerName || 'Verified Service Provider'}</h1>
          <p className="text-xs text-muted-foreground">
            Scheduled for <strong>{formatDate(request.scheduledAt, 'PPP')}</strong> at <strong>{formatTime(request.scheduledAt)}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.location.href = 'tel:+97143331111'}>
            <Phone className="h-4 w-4 text-primary" /> Call Provider
          </Button>
          {request.status !== 'completed' && request.status !== 'cancelled' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleAdvanceStatus('cancelled')}
            >
              <XCircle className="mr-1.5 h-4 w-4" /> Cancel Request
            </Button>
          )}
        </div>
      </Card>

      {/* Status Progress Stepper */}
      <Card className="p-5 border-border bg-card">
        <SectionHeader title="Care Request Status Tracker" description="Live status updates from acceptance to completion" />
        <div className="mt-4">
          <CareRequestStatusStepper currentStatus={request.status} />
        </div>
      </Card>

      {/* Real-time Status Simulator Controls (For Interactive Testing) */}
      <Card className="flex flex-col gap-3 p-4 bg-muted/20 border-dashed border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Status Simulator (Simulate Real-Time Progress)</span>
          <span className="text-2xs text-muted-foreground">Tap any state to test automatic timeline & notification updates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusSteps.map((step) => (
            <Button
              key={step.key}
              size="sm"
              variant={request.status === step.key ? 'default' : 'outline'}
              onClick={() => handleAdvanceStatus(step.key)}
              className="text-xs"
            >
              {step.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Live Map Tracking Screen (If active) */}
      {isTrackingActive && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Live Activity Tracking" description="Real-time responder location stream" />
          <LiveMapPlaceholder
            title={`${request.categoryLabel || 'Care'} Professional En Route`}
            subtitle="GPS location active"
            etaMinutes={request.estimatedArrivalMinutes || 12}
            providerName={request.employeeName || request.providerName || 'Care Professional'}
          />
        </section>
      )}

      {/* Assigned Professional & Provider Contact */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col gap-4 p-5">
          <SectionHeader title="Assigned Healthcare Professional" />
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border border-border">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" alt={request.employeeName || 'Kavya Menon'} />
              <AvatarFallback className="bg-primary/10 font-bold text-primary text-base">
                {(request.employeeName || 'Kavya Menon').split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="text-base font-bold text-foreground">{request.employeeName || 'Kavya Menon'}</span>
              <span className="text-xs text-muted-foreground">{request.employeeRole || 'Senior Nurse / Caregiver'}</span>
              <span className="mt-1 text-2xs font-semibold text-success">✓ Verified & Background Checked</span>
            </div>
          </div>
          <div className="flex gap-2 border-t border-border pt-3">
            <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => window.location.href = 'tel:+971505551212'}>
              <Phone className="h-4 w-4 text-primary" /> Call Professional
            </Button>
            <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => navigate('/portal/family/ai-assistant')}>
              <MessageSquare className="h-4 w-4 text-secondary" /> Message
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-5">
          <SectionHeader title="Care Details Summary" />
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Recipient Member</span>
              <span className="font-bold text-foreground">{request.memberName || 'Madhav Rao'}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Estimated Cost</span>
              <span className="font-bold text-primary">{request.currency || '₹'} {request.estimatedCost || 1500}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Estimated Arrival</span>
              <span className="font-bold text-secondary">~{request.estimatedArrivalMinutes || 20} minutes</span>
            </div>
            {request.notes && (
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-muted-foreground">Care Notes:</span>
                <p className="text-foreground bg-muted/20 p-2 rounded-lg border border-border">{request.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Live Timeline History */}
      {request.timeline && request.timeline.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Request Progress Timeline" description="Chronological log of state updates" />
          <Card className="p-5">
            <div className="flex flex-col space-y-4">
              {request.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-bold text-foreground">{step.title}</span>
                    {step.description && <span className="text-xs text-muted-foreground">{step.description}</span>}
                    <span className="text-2xs text-muted-foreground">{formatRelative(step.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
};

export default CareRequestDetailPage;
