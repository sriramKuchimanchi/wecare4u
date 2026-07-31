import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HandHeart, RefreshCw, Star, Calendar, ArrowRight, Eye, CheckCircle2, Clock, XCircle, Plus,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import careRequestService from '@/services/care-request.service';
import { useCareRequestStore } from '@/store';
import { formatDate, formatTime } from '@/utils/date';
import type { CareRequest } from '@/types';

export const RecentRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const setDraftCategory = useCareRequestStore((s) => s.setDraftCategory);

  useEffect(() => {
    careRequestService.list().then((res) => {
      if (res.success && res.data) setRequests(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleRepeatRequest = (req: CareRequest) => {
    setDraftCategory(req.category);
    navigate('/portal/family/request-care');
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Recent Care Requests"
        description="View past care history and repeat previous requests with one tap"
        actions={
          <Button onClick={() => navigate('/portal/family/request-care')} className="bg-primary text-primary-foreground font-bold shadow-sm">
            <Plus className="mr-1.5 h-4 w-4" /> New Care Request
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Card key={i} className="h-28 animate-pulse bg-muted/40" />)}
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <EmptyState
            icon={HandHeart}
            title="No Recent Care Requests"
            description="You haven't submitted any care requests yet. Click below to request care for your loved ones."
            action={<Button onClick={() => navigate('/portal/family/request-care')}>Request Care Now</Button>}
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="flex flex-col gap-4 p-5 transition-all hover:border-primary">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                    <HandHeart className="h-6 w-6" />
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-foreground">{req.categoryLabel || req.category}</span>
                      <Badge variant="outline" className="text-2xs capitalize font-semibold">
                        {req.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{req.providerName} · Member: {req.memberName || 'Family Member'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/portal/family/care-requests/${req.id}`)}>
                    <Eye className="mr-1.5 h-4 w-4" /> View Details
                  </Button>
                  <Button size="sm" variant="default" onClick={() => handleRepeatRequest(req)} className="bg-secondary text-secondary-foreground font-bold hover:bg-secondary/90">
                    <RefreshCw className="mr-1.5 h-4 w-4" /> Repeat Request
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Scheduled: {formatDate(req.scheduledAt, 'PPP')} at {formatTime(req.scheduledAt)}
                </span>
                <span className="font-bold text-primary">Est. Cost: {req.currency || 'AED'} {req.estimatedCost || 150}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRequestsPage;
