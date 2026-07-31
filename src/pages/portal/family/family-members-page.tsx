import { useNavigate } from 'react-router-dom';
import { Users, Plus, Pencil, Trash2, Eye, Phone } from '@/config/icons';
import { PageHeader, EmptyState } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusIndicator } from '@/components/shared';
import { Skeleton } from '@/components/shared/skeleton';
import { useFamilyMembers, useRemoveMemberMutation } from '@/hooks/use-family-portal';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/date';
import type { FamilyMember } from '@/types';

const ageOf = (dob?: string) => {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / 365.25 / 86400000);
};

export const FamilyMembersPage = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading } = useFamilyMembers();
  const removeMember = useRemoveMemberMutation();
  const { toast } = useToast();

  const handleRemove = (member: FamilyMember) => {
    if (confirm(`Remove ${member.name} from your family? This cannot be undone.`)) {
      removeMember.mutate(member.id);
      toast({ title: 'Member removed', description: `${member.name} has been removed.` });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Family Members"
        description="Manage profiles for everyone receiving care"
        actions={
          <Button onClick={() => navigate('/portal/family/members/new')}>
            <Plus className="mr-2 h-4 w-4" /> Add member
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : members.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No family members yet"
            description="Add your first family member to start coordinating their care."
            action={<Button onClick={() => navigate('/portal/family/members/new')}><Plus className="mr-2 h-4 w-4" /> Add member</Button>}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => {
            const age = ageOf(member.dateOfBirth);
            return (
              <Card key={member.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14 border border-border">
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-base font-semibold text-foreground">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.relationship}{age ? ` · ${age} years` : ''}</span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {member.bloodGroup && <Badge variant="outline" className="text-xs">{member.bloodGroup}</Badge>}
                      <StatusIndicator label={member.status === 'active' ? 'Active' : 'Inactive'} tone={member.status === 'active' ? 'success' : 'neutral'} />
                    </div>
                  </div>
                </div>

                {member.medicalConditions && member.medicalConditions.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">Medical Conditions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.medicalConditions.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                    </div>
                  </div>
                )}

                {member.emergencyContacts && member.emergencyContacts.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{member.emergencyContacts[0].name} · {member.emergencyContacts[0].phone}</span>
                  </div>
                )}

                <div className="mt-1 flex gap-2 border-t border-border pt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/portal/family/members/${member.id}`)}>
                    <Eye className="mr-1.5 h-4 w-4" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/portal/family/members/${member.id}/edit`)}>
                    <Pencil className="mr-1.5 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemove(member)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FamilyMembersPage;
