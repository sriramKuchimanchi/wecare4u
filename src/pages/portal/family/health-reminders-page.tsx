import { useMemo, useState } from 'react';
import { Pill, Plus, BellRing } from '@/config/icons';
import { PageHeader, EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MedicationReminderCard } from '@/components/care-coordination/MedicationReminderCard';
import { useMedicationReminderStore } from '@/store';
import { useFamilyMembers } from '@/hooks/use-family-portal';
import { useToast } from '@/hooks/use-toast';

const emptyForm = {
  memberId: '',
  medicineName: '',
  dosage: '',
  time: '',
  frequency: '',
  instructions: '',
};

export const HealthRemindersPage = () => {
  const { toast } = useToast();
  const reminders = useMedicationReminderStore((s) => s.reminders);
  const addReminder = useMedicationReminderStore((s) => s.addReminder);
  const { data: familyMembers = [] } = useFamilyMembers();

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const sortedReminders = useMemo(
    () => [...reminders].sort((a, b) => (a.status === 'taken' ? 1 : 0) - (b.status === 'taken' ? 1 : 0)),
    [reminders],
  );

  const pendingCount = reminders.filter((r) => r.status === 'pending' || r.status === 'snoozed').length;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = familyMembers.find((m) => m.id === form.memberId);
    if (!member || !form.medicineName.trim() || !form.time.trim()) return;

    addReminder({
      familyId: 'fam_1',
      memberId: member.id,
      memberName: member.name,
      medicineName: form.medicineName.trim(),
      dosage: form.dosage.trim() || 'As prescribed',
      time: form.time.trim(),
      frequency: form.frequency.trim() || 'Daily',
      instructions: form.instructions.trim() || undefined,
    });

    toast({ title: 'Reminder Added', description: `${form.medicineName.trim()} reminder set for ${member.name}.` });
    handleOpenChange(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Health Reminders"
        description="Medicine schedules and daily care reminders for your family"
        actions={
          <Button onClick={() => setIsOpen(true)} className="bg-primary text-primary-foreground font-bold shadow-sm">
            <Plus className="mr-1.5 h-4 w-4" /> Add Reminder
          </Button>
        }
      />

      {reminders.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <BellRing className="h-4.5 w-4.5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">{pendingCount} reminder{pendingCount === 1 ? '' : 's'} due</span>
            <span className="text-xs text-muted-foreground">{reminders.length} total across your family</span>
          </div>
        </div>
      )}

      {reminders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyState
            icon={Pill}
            title="No health reminders yet"
            description="Add a medicine or care reminder so your family never misses a dose."
            action={<Button size="sm" onClick={() => setIsOpen(true)}>Add your first reminder</Button>}
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sortedReminders.map((reminder) => (
            <MedicationReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Health Reminder</DialogTitle>
            <DialogDescription>Set a recurring medicine or care reminder for a family member.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Family Member</label>
              <select
                required
                value={form.memberId}
                onChange={(e) => setForm((f) => ({ ...f, memberId: e.target.value }))}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="" disabled>Select a family member</option>
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.relationship})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Medicine / Reminder Name</label>
              <Input
                required
                value={form.medicineName}
                onChange={(e) => setForm((f) => ({ ...f, medicineName: e.target.value }))}
                placeholder="e.g. Metformin"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Dosage</label>
                <Input
                  value={form.dosage}
                  onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
                  placeholder="e.g. 500 mg"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Time</label>
                <Input
                  required
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  placeholder="e.g. 08:00 AM"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Frequency</label>
              <Input
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
                placeholder="e.g. Daily after breakfast"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Instructions (optional)</label>
              <Input
                value={form.instructions}
                onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
                placeholder="e.g. Take with food"
              />
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={!form.memberId} className="font-bold">Add Reminder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthRemindersPage;
