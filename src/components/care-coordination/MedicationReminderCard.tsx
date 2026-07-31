import { Pill, CheckCircle, Clock, XCircle, AlertCircle } from '@/config/icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MedicationReminder } from '@/types';
import { useMedicationReminderStore, useNotificationStore, useTimelineStore } from '@/store';
import { cn } from '@/lib/utils';

export const MedicationReminderCard = ({ reminder }: { reminder: MedicationReminder }) => {
  const updateStatus = useMedicationReminderStore((s) => s.updateStatus);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addTimelineEntry = useTimelineStore((s) => s.addEntry);

  const handleAction = (status: 'taken' | 'skipped' | 'snoozed') => {
    updateStatus(reminder.id, status);
    const now = new Date().toISOString();

    const titleMap = {
      taken: `Medication Marked Taken — ${reminder.medicineName}`,
      skipped: `Medication Skipped — ${reminder.medicineName}`,
      snoozed: `Medication Snoozed — ${reminder.medicineName}`,
    };

    addNotification({
      id: `notif_med_${Date.now()}`,
      userId: 'user_family_1',
      title: titleMap[status],
      message: `${reminder.memberName} (${reminder.dosage}) at ${reminder.time}`,
      read: false,
      type: status === 'taken' ? 'success' : status === 'skipped' ? 'warning' : 'info',
      createdAt: now,
      updatedAt: now,
    });

    addTimelineEntry({
      id: `tl_med_${Date.now()}`,
      familyId: reminder.familyId,
      memberId: reminder.memberId,
      eventType: 'medication-reminder',
      title: titleMap[status],
      description: `${reminder.memberName}: ${reminder.dosage} · ${reminder.instructions || 'Daily dose'}`,
      createdAt: now,
      updatedAt: now,
    });
  };

  const statusBadge = () => {
    switch (reminder.status) {
      case 'taken':
        return <Badge variant="secondary" className="gap-1 bg-success/15 text-success"><CheckCircle className="h-3 w-3" /> Taken</Badge>;
      case 'skipped':
        return <Badge variant="outline" className="gap-1 text-muted-foreground"><XCircle className="h-3 w-3" /> Skipped</Badge>;
      case 'snoozed':
        return <Badge variant="secondary" className="gap-1 bg-warning/15 text-warning"><Clock className="h-3 w-3" /> Snoozed 15m</Badge>;
      default:
        return <Badge variant="outline" className="gap-1 text-primary"><AlertCircle className="h-3 w-3" /> Due at {reminder.time}</Badge>;
    }
  };

  return (
    <Card className={cn('flex flex-col gap-3 p-4 transition-all', reminder.status === 'taken' && 'opacity-75 bg-muted/20')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            reminder.status === 'taken' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'
          )}>
            <Pill className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">{reminder.medicineName}</span>
            <span className="text-xs text-muted-foreground">{reminder.memberName} · {reminder.dosage}</span>
            <span className="text-2xs text-muted-foreground">{reminder.frequency}</span>
          </div>
        </div>
        {statusBadge()}
      </div>

      {reminder.instructions && (
        <p className="rounded-lg bg-surface p-2 text-xs text-muted-foreground border border-border">
          💡 {reminder.instructions}
        </p>
      )}

      {reminder.status !== 'taken' && (
        <div className="flex gap-2 border-t border-border pt-3">
          <Button
            size="sm"
            variant="default"
            className="flex-1 bg-success hover:bg-success/90 text-white"
            onClick={() => handleAction('taken')}
          >
            <CheckCircle className="mr-1.5 h-4 w-4" /> Taken
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => handleAction('snoozed')}
          >
            <Clock className="mr-1.5 h-4 w-4 text-warning" /> Snooze
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => handleAction('skipped')}
          >
            Skip
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MedicationReminderCard;
