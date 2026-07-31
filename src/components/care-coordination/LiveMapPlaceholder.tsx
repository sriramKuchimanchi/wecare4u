import { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Siren, ShieldCheck } from '@/config/icons';
import { cn } from '@/lib/utils';

type LiveMapPlaceholderProps = {
  title?: string;
  subtitle?: string;
  isEmergency?: boolean;
  etaMinutes?: number;
  providerName?: string;
  className?: string;
};

export const LiveMapPlaceholder = ({
  title = 'Live GPS Location Tracking',
  subtitle = 'Real-time location active',
  isEmergency = false,
  etaMinutes = 10,
  providerName = 'Emergency Responder',
  className,
}: LiveMapPlaceholderProps) => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPulse((p) => (p + 1) % 100), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn('relative flex h-64 w-full flex-col overflow-hidden rounded-2xl border border-border bg-slate-900 text-white shadow-card md:h-72', className)}>
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Simulated Route Line */}
      <svg className="absolute inset-0 h-full w-full stroke-primary/60 stroke-[3] fill-none" strokeDasharray="6,6">
        <path d="M 50 180 Q 150 100 280 140 T 450 60" />
      </svg>

      {/* Origin Pin (Home) */}
      <div className="absolute left-[15%] top-[65%] flex flex-col items-center gap-1">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg">
          <MapPin className="h-4 w-4" />
        </span>
        <span className="rounded-md bg-slate-800/90 px-2 py-0.5 text-2xs font-semibold text-white shadow-sm border border-slate-700">
          Home (Apt 1203)
        </span>
      </div>

      {/* Moving Responder Pin */}
      <div className="absolute right-[25%] top-[25%] flex flex-col items-center gap-1">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white shadow-lg animate-bounce">
          <span className="absolute -inset-2 animate-ping rounded-full bg-secondary/40" />
          <Navigation className="h-5 w-5 rotate-45" />
        </span>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-2xs font-bold text-white shadow-sm">
          {providerName} (~{etaMinutes} min)
        </span>
      </div>

      {/* Map Control Overlay Top Left */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-slate-900/80 p-2.5 backdrop-blur-md border border-slate-700">
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', isEmergency ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary')}>
          {isEmergency ? <Siren className="h-4 w-4 animate-pulse" /> : <Compass className="h-4 w-4" />}
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">{title}</span>
          <span className="text-2xs text-slate-300">{subtitle}</span>
        </div>
      </div>

      {/* ETA Chip Top Right */}
      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2 backdrop-blur-md border border-slate-700">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <div className="flex flex-col items-end">
          <span className="text-2xs text-slate-400 uppercase font-semibold">EST. ARRIVAL</span>
          <span className="text-sm font-black text-emerald-400">{etaMinutes} MINS</span>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-auto z-10 flex items-center justify-between border-t border-slate-800 bg-slate-900/90 px-4 py-2.5 backdrop-blur-md text-2xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          Live GPS stream connected · 25.0772° N, 55.1332° E
        </span>
        <span className="font-semibold text-slate-400">Speed: 42 km/h</span>
      </div>
    </div>
  );
};

export default LiveMapPlaceholder;
