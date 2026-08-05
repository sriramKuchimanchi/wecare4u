import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Input } from '@/components/ui/input';
import { useEmployeeRequestsQuery } from '@/hooks/use-portal-queries';
import { mockFamilyMembers, mockProviderServices } from '@/utils/mock-data';

export const EmployeeSearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const { data: requests = [] } = useEmployeeRequestsQuery('emp_1');

  const filteredRequests = requests.filter(
    (r) =>
      r.patientName?.toLowerCase().includes(query.toLowerCase()) ||
      r.familyName?.toLowerCase().includes(query.toLowerCase()) ||
      r.categoryLabel?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFamilies = mockFamilyMembers.filter(
    (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.relationship.toLowerCase().includes(query.toLowerCase())
  );

  const filteredServices = mockProviderServices.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Field Operations Search</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Search assigned families, care requests and services</p>
      </div>

      <div className="relative max-w-xl">
        <icons.Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search patient name, family, request category or service..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11 text-sm rounded-xl"
        />
      </div>

      <div className="space-y-6">
        {/* Requests Search Result */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.ClipboardList className="h-5 w-5 text-primary" /> Assigned Care Bookings ({filteredRequests.length})
          </h2>

          <div className="space-y-2">
            {filteredRequests.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/portal/employee/bookings/${r.id}`)}
                className="cursor-pointer rounded-xl bg-muted/40 p-3 text-xs flex items-center justify-between border hover:border-primary/40"
              >
                <div>
                  <h3 className="font-bold text-foreground">{r.patientName || 'Madhav Rao'}</h3>
                  <p className="text-muted-foreground">{r.categoryLabel || r.category} • {r.address?.line1}</p>
                </div>
                <span className="font-bold text-emerald-600 capitalize">{r.status.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Families / Patients */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.Users className="h-5 w-5 text-primary" /> Senior Citizens & Patients ({filteredFamilies.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {filteredFamilies.map((m) => (
              <div key={m.id} className="rounded-xl bg-muted/40 p-3 border">
                <h3 className="font-bold text-foreground">{m.name}</h3>
                <p className="text-muted-foreground">{m.relationship} • Blood Group: {m.bloodGroup}</p>
                {m.medicalConditions && (
                  <p className="text-2xs font-semibold text-primary mt-1">
                    Conditions: {m.medicalConditions.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Services offered */}
        <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <icons.Stethoscope className="h-5 w-5 text-primary" /> Services Offered ({filteredServices.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {filteredServices.map((s) => (
              <div key={s.id} className="rounded-xl bg-muted/40 p-3 border flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-foreground">{s.name}</h3>
                  <p className="text-muted-foreground">{s.category} • {s.responseTime}</p>
                </div>
                <span className="font-bold text-foreground">₹{s.pricing.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
