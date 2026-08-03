import { useNavigate } from 'react-router-dom';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminEmergenciesQuery } from '@/hooks/use-portal-queries';

export const EmergencyCenterPage = () => {
  const navigate = useNavigate();
  const { data: emergencies = [], isLoading } = useAdminEmergenciesQuery();

  const active = emergencies.filter((e: any) => e.status === 'active');
  const resolved = emergencies.filter((e: any) => e.status === 'resolved');

  return (
    <div className="space-y-5 pb-8">
      <div className="rounded-2xl border border-border/60 bg-surface p-4 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <icons.Siren className="h-4 w-4 text-red-600" /> Emergency Operations Center
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Live Emergency Operations</h1>
            <p className="mt-1 text-sm text-muted-foreground">Active incidents: {active.length} · Resolved today: {resolved.length}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <icons.Siren className="mr-2 h-4 w-4 text-red-600" /> Active Incidents
            </Button>
          </div>
        </div>
      </div>

      {/* Active Live Emergencies */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <icons.Siren className="h-5 w-5 text-red-600 animate-pulse" /> Active Live Emergencies ({active.length})
        </h2>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <icons.Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : active.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {active.map((em: any) => (
              <div key={em.id} className="rounded-2xl border-2 border-red-500/80 bg-surface p-6 shadow-md relative overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Left: Patient & Live Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-3 w-3 rounded-full bg-red-600 animate-ping" />
                      <h3 className="text-xl font-black text-foreground">{em.memberName}</h3>
                      <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full font-extrabold tracking-wider uppercase">
                        CRITICAL SOS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                        <p className="text-muted-foreground font-medium uppercase text-2xs">GPS Location</p>
                        <p className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                          <icons.MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
                          {em.location?.line1}, {em.location?.city}
                        </p>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                        <p className="text-muted-foreground font-medium uppercase text-2xs">Assigned Service Provider</p>
                        <p className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                          <icons.Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          {em.assignedProvider?.name ?? 'Assigning...'} (ETA {em.assignedProvider?.etaMinutes ?? 10}m)
                        </p>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                        <p className="text-muted-foreground font-medium uppercase text-2xs">Assigned EMT / Doctor</p>
                        <p className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                          <icons.UserCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          {em.assignedProfessional?.name} ({em.assignedProfessional?.role})
                        </p>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                        <p className="text-muted-foreground font-medium uppercase text-2xs">Ambulance & Hospital</p>
                        <p className="font-bold text-foreground mt-0.5 flex items-center gap-1 truncate">
                          <icons.Ambulance className="h-3.5 w-3.5 text-red-600 shrink-0" />
                          {em.assignedAmbulance?.vehicleNumber} → {em.notifiedHospital?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Map Placeholder */}
                  <div className="w-full lg:w-80 flex flex-col justify-between gap-4 bg-red-50/50 dark:bg-red-950/20 p-4 rounded-xl border border-red-200 dark:border-red-900">
                    <div>
                      <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
                        <icons.Map className="h-4 w-4" /> Live GPS Map Simulation
                      </p>
                      <div className="h-28 rounded-lg bg-slate-800 flex flex-col items-center justify-center text-white p-3 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                        <icons.Navigation className="h-6 w-6 text-red-400 animate-bounce mb-1" />
                        <span className="text-2xs font-mono">19.0760° N, 72.8777° E</span>
                        <span className="text-2xs text-slate-400">Tracking Unit MH-02-AB-1234</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/portal/admin/emergency/${em.id}`)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 shadow-md"
                    >
                      Open Live Ops Timeline <icons.ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-surface p-8 text-center text-muted-foreground">
            <icons.CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <p className="font-bold text-foreground">All Clear — No Active Emergencies</p>
            <p className="text-xs mt-1">Platform automated dispatchers on standby</p>
          </div>
        )}
      </div>

      {/* Resolved Emergencies History */}
      <div className="space-y-3 pt-4">
        <h3 className="text-md font-bold text-foreground">Recent Emergency History</h3>
        <div className="rounded-2xl border border-border/60 bg-surface overflow-hidden">
          <div className="divide-y divide-border/40">
            {resolved.map((em: any) => (
              <div key={em.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold shrink-0">
                    <icons.Check className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{em.memberName} Emergency</p>
                    <p className="text-xs text-muted-foreground">
                      {em.location?.line1} · Handled by {em.assignedProvider?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                    Resolved
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/portal/admin/emergency/${em.id}`)}>
                    <icons.Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCenterPage;
