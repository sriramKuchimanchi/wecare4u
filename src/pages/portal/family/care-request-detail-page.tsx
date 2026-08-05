import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Phone, MapPin, XCircle, CheckCircle2, AlertCircle, FileText, Image as ImageIcon,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/shared/skeleton';
import { CareRequestStatusStepper } from '@/components/care-coordination/CareRequestStatusStepper';
import { LiveMapPlaceholder } from '@/components/care-coordination/LiveMapPlaceholder';
import { useCareRequestDetail, useCancelCareRequestMutation } from '@/hooks/use-family-portal';
import { formatDate, formatTime, formatRelative } from '@/utils/date';

export const CareRequestDetailPage = () => {
  const { requestId: paramId } = useParams<{ requestId?: string }>();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const requestId = paramId || segments[segments.length - 1];

  const navigate = useNavigate();
  const { data: request, isLoading } = useCareRequestDetail(requestId ?? '');
  const cancelMutation = useCancelCareRequestMutation();

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
          title="Booking Not Found"
          description="The requested care booking details could not be found."
          action={<Button onClick={() => navigate('/portal/family/request-care')}>Back to Request Service</Button>}
        />
      </Card>
    );
  }

  const isTrackingActive = ['on_the_way', 'arrived', 'in_progress'].includes(request.status);

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Bookings
      </Button>

      {/* Header Info Card */}
      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center justify-between border-border bg-card shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Care Booking #{request.id.slice(-6)}</span>
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
              onClick={() => cancelMutation.mutate(request.id)}
              disabled={cancelMutation.isPending}
            >
              <XCircle className="mr-1.5 h-4 w-4" /> Cancel Booking
            </Button>
          )}
        </div>
      </Card>

      {/* Status Progress Stepper */}
      <Card className="p-5 border-border bg-card">
        <SectionHeader title="Care Booking Status Tracker" description="Live status updates from acceptance to completion" />
        <div className="mt-4">
          <CareRequestStatusStepper currentStatus={request.status} timeline={request.timeline} />
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
            providerName={request.providerName || 'Care Professional'}
          />
        </section>
      )}

      {/* Service Location & Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col gap-4 p-5">
          <SectionHeader title="Service Location" />
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-foreground">{request.address?.line1 || 'Address not specified'}</span>
              <span className="text-xs text-muted-foreground">
                {[request.address?.city, request.address?.state, request.address?.country].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-5">
          <SectionHeader title="Care Details Summary" />
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Recipient Member</span>
              <span className="font-bold text-foreground">{request.memberName || 'Family Member'}</span>
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
          <SectionHeader title="Booking Progress Timeline" description="Chronological log of state updates" />
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

      {/* Visit Documents — only once the provider has completed the visit */}
      {request.status === 'completed' && request.attachments && request.attachments.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Visit Documents" description="Photos and documents shared by your care provider" />
          <Card className="flex flex-wrap gap-3 p-5">
            {request.attachments.map((att) => (
              <a
                key={att.id}
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/40"
              >
                {att.kind === 'image' ? <ImageIcon className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
                <span className="max-w-[160px] truncate">{att.name}</span>
              </a>
            ))}
          </Card>
        </section>
      )}
    </div>
  );
};

export default CareRequestDetailPage;
