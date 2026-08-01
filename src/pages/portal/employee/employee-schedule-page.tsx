import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { useEmployeeRequestsQuery } from '@/hooks/use-portal-queries';
import { cn } from '@/lib/utils';

export const EmployeeSchedulePage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'today' | 'tomorrow' | 'week'>('today');

  const { data: requests = [] } = useEmployeeRequestsQuery('emp_1');

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Field Schedule</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Assigned patient visits, travel estimates and shift times</p>
        </div>

        <div className="flex items-center rounded-xl bg-muted p-1 border">
          {(['today', 'tomorrow', 'week'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                tab === t ? 'bg-surface text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((r) => (
          <div
            key={r.id}
            onClick={() => navigate(`/portal/employee/requests/${r.id}`)}
            className="cursor-pointer rounded-2xl bg-surface p-5 border border-border/60 shadow-xs hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-20 shrink-0 font-bold text-xs text-primary flex items-center gap-1">
                <icons.Clock className="h-4 w-4" />{' '}
                {new Date(r.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">{r.patientName || 'Madhav Rao'}</h3>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {r.categoryLabel || r.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Location: {r.address?.line1 || 'Dubai'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold capitalize px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                {r.status.replace(/_/g, ' ')}
              </span>
              <icons.ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
