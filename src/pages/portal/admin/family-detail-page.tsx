import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminFamilyQuery, useUpdateFamilyMemberMutation } from '@/hooks/use-portal-queries';
import { useToast } from '@/hooks/use-toast';

export const FamilyDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const segments = location.pathname.split('/').filter(Boolean);
  const familyId = segments[segments.length - 1];

  const { data: family, isLoading } = useAdminFamilyQuery(familyId);
  const updateMemberMutation = useUpdateFamilyMemberMutation();

  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
      <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (!family) return <div className="text-center py-12 text-muted-foreground">Family not found.</div>;

  const bloodColors: Record<string, string> = {
    'A+': 'bg-red-100 text-red-700',
    'B+': 'bg-orange-100 text-orange-700',
    'O+': 'bg-pink-100 text-pink-700',
    'AB+': 'bg-purple-100 text-purple-700',
    'A-': 'bg-red-100 text-red-700',
    'B-': 'bg-orange-100 text-orange-700',
    'O-': 'bg-pink-100 text-pink-700',
    'AB-': 'bg-purple-100 text-purple-700'
  };

  const handleOpenMemberModal = (mem: any) => {
    setSelectedMember(mem);
    setIsEditing(false);
    setEditFormData({
      name: mem.name || '',
      relationship: mem.relationship || '',
      gender: mem.gender || 'male',
      dateOfBirth: mem.dateOfBirth || '',
      bloodGroup: mem.bloodGroup || 'O+',
      status: mem.status || 'active',
      governmentIdType: mem.governmentIdType || 'aadhaar',
      governmentIdNumber: mem.governmentIdNumber || '',
      medicalConditions: (mem.medicalConditions || []).join(', '),
      allergies: (mem.allergies || []).join(', '),
      medicalNotes: mem.medicalNotes || '',
      insuranceProvider: mem.insurance?.provider || '',
      insurancePolicyNumber: mem.insurance?.policyNumber || '',
    });
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const patch = {
        name: editFormData.name,
        relationship: editFormData.relationship,
        gender: editFormData.gender,
        dateOfBirth: editFormData.dateOfBirth,
        bloodGroup: editFormData.bloodGroup,
        status: editFormData.status,
        governmentIdType: editFormData.governmentIdType,
        governmentIdNumber: editFormData.governmentIdNumber,
        medicalConditions: editFormData.medicalConditions
          ? editFormData.medicalConditions.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
        allergies: editFormData.allergies
          ? editFormData.allergies.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
        medicalNotes: editFormData.medicalNotes,
        insurance: {
          provider: editFormData.insuranceProvider,
          policyNumber: editFormData.insurancePolicyNumber,
        },
      };

      await updateMemberMutation.mutateAsync({
        familyId,
        memberId: selectedMember.id,
        patch,
      });

      toast({ title: 'Member Updated', description: `${editFormData.name}'s details have been saved.` });
      setSelectedMember((prev: any) => ({ ...prev, ...patch }));
      setIsEditing(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to update member details.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/portal/admin/families')}>
          <icons.ArrowLeft className="h-4 w-4 mr-1" /> Families
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold text-foreground">{family.name}</span>
      </div>

      <div className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {family.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-foreground">{family.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Primary Contact: {family.primaryContactName}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><icons.Phone className="h-3 w-3" />{family.contact?.phone}</span>
              <span className="flex items-center gap-1"><icons.Mail className="h-3 w-3" />{family.contact?.email}</span>
              <span className="flex items-center gap-1"><icons.MapPin className="h-3 w-3" />{family.address?.city}, {family.address?.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Members', value: family.members?.length ?? 0, icon: icons.Users, color: 'bg-blue-100 text-blue-600' },
          { label: 'Total Bookings', value: family.careRequests?.length ?? 0, icon: icons.ClipboardList, color: 'bg-sky-100 text-sky-600' },
          { label: 'Emergencies', value: family.emergencies?.length ?? 0, icon: icons.Siren, color: 'bg-red-100 text-red-600' },
          { label: 'Status', value: 'active', icon: icons.CheckCircle, color: 'bg-green-100 text-green-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl bg-surface border border-border/60 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('h-8 w-8 flex items-center justify-center rounded-lg', color)}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground capitalize">{value}</p>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground">Family Members</h2>
            <p className="text-xs text-muted-foreground">Select a member to view full health profile and edit information</p>
          </div>
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {family.members?.length ?? 0} Members
          </span>
        </div>
        <div className="divide-y divide-border/40">
          {family.members?.map((mem: any) => (
            <div
              key={mem.id}
              onClick={() => handleOpenMemberModal(mem)}
              className="px-5 py-4 flex items-center gap-4 hover:bg-muted/40 transition-colors cursor-pointer group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                {mem.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{mem.name}</p>
                  <span className={cn('text-2xs font-semibold px-2 py-0.5 rounded-full capitalize', mem.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600')}>
                    {mem.status || 'active'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {mem.relationship} · {mem.gender}
                  {mem.dateOfBirth && ` · Born ${mem.dateOfBirth}`}
                </p>
                {mem.medicalConditions?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {mem.medicalConditions.map((c: string) => (
                      <span key={c} className="text-2xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {mem.bloodGroup && (
                  <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg', bloodColors[mem.bloodGroup] ?? 'bg-gray-100 text-gray-700')}>
                    {mem.bloodGroup}
                  </span>
                )}
                <Button variant="ghost" size="sm" className="text-xs text-primary group-hover:bg-primary/10">
                  <icons.Eye className="h-4 w-4 mr-1" /> View & Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Requests */}
      {family.careRequests?.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Service Bookings</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/portal/admin/bookings')} className="text-xs text-primary">View All</Button>
          </div>
          <div className="divide-y divide-border/40">
            {family.careRequests.slice(0, 5).map((req: any) => (
              <div key={req.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{req.categoryLabel ?? req.category}</p>
                  <p className="text-xs text-muted-foreground">{req.patientName} · {req.providerName}</p>
                </div>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize',
                  req.status === 'completed' ? 'bg-green-100 text-green-700' :
                  req.status === 'in_progress' ? 'bg-sky-100 text-sky-700' :
                  req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                )}>
                  {req.status?.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergencies */}
      {family.emergencies?.length > 0 && (
        <div className="rounded-2xl bg-surface border border-border/60 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <icons.Siren className="h-4 w-4 text-red-600" /> Emergency History
            </h2>
          </div>
          <div className="divide-y divide-border/40">
            {family.emergencies.map((em: any) => (
              <div key={em.id} className="px-5 py-3 flex items-center gap-3">
                <icons.Siren className={cn('h-4 w-4 shrink-0', em.status === 'active' ? 'text-red-600 animate-pulse' : 'text-muted-foreground')} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{em.memberName} Emergency</p>
                  <p className="text-xs text-muted-foreground">{em.assignedProvider?.name ?? 'Unassigned'}</p>
                </div>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', em.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                  {em.status}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/portal/admin/emergency/${em.id}`)}>
                  <icons.Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEMBER DETAIL & EDIT MODAL */}
      {selectedMember && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedMember.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedMember.relationship} · {selectedMember.gender} · {family.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <icons.Pencil className="h-4 w-4 mr-1" /> Edit Details
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel Edit
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                  Close
                </Button>
              </div>
            </div>

            {/* Content: View Mode vs Edit Mode */}
            {!isEditing ? (
              <div className="space-y-5 text-sm">
                {/* Personal Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Personal Information</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-surface p-4 border border-border/60">
                    <div>
                      <span className="text-2xs text-muted-foreground block">Relationship</span>
                      <span className="font-semibold text-foreground capitalize">{selectedMember.relationship}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block">Gender</span>
                      <span className="font-semibold text-foreground capitalize">{selectedMember.gender || '—'}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block">Date of Birth</span>
                      <span className="font-semibold text-foreground">{selectedMember.dateOfBirth || '—'}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block">Blood Group</span>
                      <span className="font-bold text-red-600">{selectedMember.bloodGroup || '—'}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block">Status</span>
                      <span className="font-semibold text-foreground capitalize">{selectedMember.status || 'active'}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block">Government ID</span>
                      <span className="font-semibold text-foreground uppercase">
                        {selectedMember.governmentIdType || 'ID'} : {selectedMember.governmentIdNumber || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Medical Summary</h4>
                  <div className="space-y-3 rounded-xl bg-surface p-4 border border-border/60">
                    <div>
                      <span className="text-2xs text-muted-foreground block mb-1">Medical Conditions</span>
                      {selectedMember.medicalConditions && selectedMember.medicalConditions.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedMember.medicalConditions.map((c: string) => (
                            <span key={c} className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">None recorded</span>
                      )}
                    </div>

                    <div>
                      <span className="text-2xs text-muted-foreground block mb-1">Allergies</span>
                      {selectedMember.allergies && selectedMember.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedMember.allergies.map((a: string) => (
                            <span key={a} className="text-xs font-medium bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No known allergies</span>
                      )}
                    </div>

                    <div>
                      <span className="text-2xs text-muted-foreground block">Medical Notes</span>
                      <p className="text-xs text-foreground mt-0.5">{selectedMember.medicalNotes || 'No notes provided.'}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Insurance</h4>
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-4 border border-border/60">
                    <div>
                      <span className="text-2xs text-muted-foreground block">Provider</span>
                      <span className="font-semibold text-foreground">{selectedMember.insurance?.provider || '—'}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block">Policy Number</span>
                      <span className="font-semibold text-foreground">{selectedMember.insurance?.policyNumber || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts */}
                {selectedMember.emergencyContacts && selectedMember.emergencyContacts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Emergency Contacts</h4>
                    <div className="space-y-2">
                      {selectedMember.emergencyContacts.map((c: any, i: number) => (
                        <div key={i} className="flex items-center justify-between rounded-xl bg-surface p-3 border border-border/60 text-xs">
                          <div>
                            <span className="font-bold text-foreground">{c.name}</span>
                            <span className="text-muted-foreground ml-2">({c.relationship})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-muted-foreground">{c.phone}</span>
                            {c.isPrimary && <span className="bg-destructive/10 text-destructive text-2xs font-bold px-2 py-0.5 rounded-full">Primary</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Edit Form */
              <form onSubmit={handleSaveMember} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      required
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Relationship</label>
                    <input
                      type="text"
                      value={editFormData.relationship}
                      onChange={(e) => setEditFormData({ ...editFormData, relationship: e.target.value })}
                      required
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Gender</label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editFormData.dateOfBirth}
                      onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Blood Group</label>
                    <select
                      value={editFormData.bloodGroup}
                      onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Account Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Government ID Type</label>
                    <input
                      type="text"
                      value={editFormData.governmentIdType}
                      onChange={(e) => setEditFormData({ ...editFormData, governmentIdType: e.target.value })}
                      placeholder="e.g. aadhaar / passport"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Government ID Number</label>
                    <input
                      type="text"
                      value={editFormData.governmentIdNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, governmentIdNumber: e.target.value })}
                      placeholder="ID Number"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Medical Conditions (comma separated)</label>
                  <input
                    type="text"
                    value={editFormData.medicalConditions}
                    onChange={(e) => setEditFormData({ ...editFormData, medicalConditions: e.target.value })}
                    placeholder="Hypertension, Type 2 Diabetes"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Allergies (comma separated)</label>
                  <input
                    type="text"
                    value={editFormData.allergies}
                    onChange={(e) => setEditFormData({ ...editFormData, allergies: e.target.value })}
                    placeholder="Penicillin, Aspirin"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Medical Notes</label>
                  <textarea
                    rows={2}
                    value={editFormData.medicalNotes}
                    onChange={(e) => setEditFormData({ ...editFormData, medicalNotes: e.target.value })}
                    placeholder="Physiotherapy required twice a week..."
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      value={editFormData.insuranceProvider}
                      onChange={(e) => setEditFormData({ ...editFormData, insuranceProvider: e.target.value })}
                      placeholder="Star Health"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Insurance Policy No.</label>
                    <input
                      type="text"
                      value={editFormData.insurancePolicyNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, insurancePolicyNumber: e.target.value })}
                      placeholder="SH-123456"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMemberMutation.isPending}>
                    {updateMemberMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      , document.body)}
    </div>
  );
};

export default FamilyDetailPage;
