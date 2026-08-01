import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone, Plus, Pencil, Trash2, Shield, ArrowLeft, Star, Globe, CheckCircle2, User,
} from '@/config/icons';
import { PageHeader, SectionHeader, EmptyState } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEmergencyContactsStore } from '@/store';
import type { EmergencyContact } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const EmergencyContactsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const contacts = useEmergencyContactsStore((s) => s.contacts);
  const addContact = useEmergencyContactsStore((s) => s.addContact);
  const updateContact = useEmergencyContactsStore((s) => s.updateContact);
  const deleteContact = useEmergencyContactsStore((s) => s.deleteContact);
  const setPrimary = useEmergencyContactsStore((s) => s.setPrimary);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState<'primary' | 'secondary' | 'normal'>('normal');
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  const handleOpenForm = (contact?: EmergencyContact) => {
    if (contact) {
      setEditingId(contact.id || null);
      setName(contact.name);
      setRelationship(contact.relationship);
      setPhone(contact.phone);
      setPriority(contact.priority || 'normal');
      setPreferredLanguage(contact.preferredLanguage || 'English');
    } else {
      setEditingId(null);
      setName('');
      setRelationship('');
      setPhone('');
      setPriority('normal');
      setPreferredLanguage('English');
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name || !phone) {
      toast({ title: 'Validation Error', description: 'Name and phone number are required.', variant: 'destructive' });
      return;
    }

    if (editingId) {
      updateContact(editingId, {
        name,
        relationship,
        phone,
        priority,
        isPrimary: priority === 'primary',
        preferredLanguage,
      });
      toast({ title: 'Contact Updated', description: 'Emergency contact has been updated.' });
    } else {
      const newContact: EmergencyContact = {
        id: `cnt_${Date.now()}`,
        name,
        relationship,
        phone,
        priority,
        isPrimary: priority === 'primary',
        preferredLanguage,
      };
      addContact(newContact);
      if (priority === 'primary') setPrimary(newContact.id!);
      toast({ title: 'Contact Added', description: 'New emergency contact saved.' });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, nameStr: string) => {
    if (confirm(`Are you sure you want to delete ${nameStr} from emergency contacts?`)) {
      deleteContact(id);
      toast({ title: 'Contact Removed', description: `${nameStr} removed.` });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-fit">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </Button>

      <PageHeader
        title="Emergency Contacts Management"
        description="Set up and manage the contacts alerted automatically during emergency SOS triggers"
        actions={
          <Button onClick={() => handleOpenForm()} className="bg-primary text-primary-foreground font-bold shadow-sm">
            <Plus className="mr-1.5 h-4 w-4" /> Add Emergency Contact
          </Button>
        }
      />

      {contacts.length === 0 ? (
        <Card>
          <EmptyState
            icon={Phone}
            title="No Emergency Contacts Added"
            description="Add your primary and secondary emergency contacts to ensure automated alerts work seamlessly."
            action={<Button onClick={() => handleOpenForm()}><Plus className="mr-1.5 h-4 w-4" /> Add Contact</Button>}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <Card key={c.id || c.name} className="flex flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-base">
                  {c.name.charAt(0)}
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-foreground">{c.name}</span>
                    {c.isPrimary && <Badge variant="secondary" className="text-2xs bg-secondary/15 text-secondary-foreground font-bold">Primary</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">{c.relationship}</span>
                  <span className="text-xs font-semibold text-primary">{c.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-2xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border">
                <span>Priority: <strong>{c.priority || 'Normal'}</strong></span>
                <span>· Language: <strong>{c.preferredLanguage || 'English'}</strong></span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                {!c.isPrimary ? (
                  <Button size="sm" variant="outline" onClick={() => setPrimary(c.id!)}>
                    Make Primary
                  </Button>
                ) : (
                  <span className="text-2xs font-bold text-success flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Primary Alert Contact
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleOpenForm(c)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(c.id!, c.name)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingId ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold">Contact Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aaradhya Rao"
                className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold">Relationship</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Daughter / Son / Family Doctor"
                className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold">Phone Number (With Country Code)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Hindi">Hindi</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground font-bold" onClick={handleSave}>
                Save Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyContactsPage;
