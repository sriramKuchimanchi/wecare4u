import { useParams, useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { useProviderEmployeeDetailQuery, useProviderRequestsQuery } from '@/hooks/use-portal-queries';
import { cn } from '@/lib/utils';

export const EmployeeProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const empId = id ?? 'emp_1';
  const { data: employee, isLoading } = useProviderEmployeeDetailQuery(empId);
  const { data: requests = [] } = useProviderRequestsQuery();

  if (isLoading || !employee) {
    return (
      <div className="flex h-96 items-center justify-center">
        <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const assignedRequests = requests.filter((r) => r.employeeId === employee.id);
  const completedRequests = assignedRequests.filter((r) => r.status === 'completed' || r.status === 'awaiting_review');

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Navigation */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/portal/care-provider/employees')}>
          <icons.ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Employee Profile</h1>
          <p className="text-xs text-muted-foreground">Credentials, schedule & performance history</p>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={employee.avatarUrl || 'https://images.unsplash.com/photo-1594824813566-7885a3964478?auto=format&fit=crop&q=80&w=200'}
            alt={employee.name}
            className="h-20 w-20 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-foreground">{employee.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold bg-primary/10 text-primary capitalize">
                {employee.availability.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs font-semibold text-primary">{employee.role}</p>
            <p className="text-xs text-muted-foreground">
              {employee.department} • License #{employee.licenseNumber || 'DHA-88219'}
            </p>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-3 gap-3 text-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
          <div className="p-2">
            <span className="text-2xs text-muted-foreground uppercase font-semibold">Assigned</span>
            <p className="text-xl font-black text-foreground">{assignedRequests.length}</p>
          </div>
          <div className="p-2 border-x">
            <span className="text-2xs text-muted-foreground uppercase font-semibold">Completed</span>
            <p className="text-xl font-black text-emerald-600">{completedRequests.length || employee.completedRequestsCount || 98}</p>
          </div>
          <div className="p-2">
            <span className="text-2xs text-muted-foreground uppercase font-semibold">Rating</span>
            <p className="text-xl font-black text-amber-600 flex items-center justify-center gap-1">
              <icons.Star className="h-4 w-4 fill-current" /> {employee.rating ?? 4.9}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Details & Today Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Working Availability & Hours */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.Clock className="h-5 w-5 text-primary" /> Availability & Schedule Preference
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted/40 p-4 border space-y-1">
                <span className="text-2xs font-semibold text-muted-foreground uppercase">Working Days</span>
                <p className="text-sm font-bold text-foreground">
                  {employee.workingDays ? employee.workingDays.join(', ') : 'Monday - Friday'}
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 p-4 border space-y-1">
                <span className="text-2xs font-semibold text-muted-foreground uppercase">Working Hours</span>
                <p className="text-sm font-bold text-foreground">{employee.workingHours || '08:00 AM - 05:00 PM'}</p>
              </div>
            </div>
          </div>

          {/* Today's Schedule & Assigned Visits */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.CalendarDays className="h-5 w-5 text-primary" /> Today's Assigned Care Visits
            </h3>

            {assignedRequests.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No visits assigned to this staff member currently.</p>
            ) : (
              <div className="space-y-3">
                {assignedRequests.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/portal/care-provider/requests/${r.id}`)}
                    className="cursor-pointer rounded-xl bg-muted/30 p-4 border border-border/60 hover:border-primary/40 transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">{r.patientName || 'Mohammed Rahman'}</h4>
                        <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {r.categoryLabel || r.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{r.address?.line1 || 'Dubai'}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-foreground">
                        {new Date(r.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <p className="text-2xs font-bold text-emerald-600 capitalize mt-0.5">{r.status.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Credentials & Certificates */}
        <div className="space-y-6">
          {/* Government ID & Credentials */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.ShieldCheck className="h-5 w-5 text-primary" /> License & Gov ID
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">ID Type:</span>
                <span className="font-semibold text-foreground uppercase">{employee.governmentIdType || 'National ID'}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">ID Number:</span>
                <span className="font-semibold text-foreground">{employee.governmentIdNumber || '784-1988-1234567-1'}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Languages:</span>
                <span className="font-semibold text-foreground">{employee.languages?.join(', ') || 'Arabic, English'}</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-foreground mb-2">Professional Certifications</h4>
              <div className="flex flex-wrap gap-1.5">
                {employee.certificates?.map((cert, i) => (
                  <span key={i} className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-2xs font-bold text-emerald-700 border border-emerald-500/20">
                    ✓ {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <icons.Phone className="h-5 w-5 text-primary" /> Emergency Contact
            </h3>

            <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1 border">
              <p className="font-bold text-foreground">{employee.emergencyContact?.name || 'Sami Al-Nasser'}</p>
              <p className="text-muted-foreground">Relationship: {employee.emergencyContact?.relationship || 'Brother'}</p>
              <p className="font-semibold text-primary pt-1">{employee.emergencyContact?.phone || '+971 50 999 8877'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
