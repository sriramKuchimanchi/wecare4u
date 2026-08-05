import { MapPin, Navigation, Compass, Siren, ShieldCheck } from '@/config/icons';
import { cn } from '@/lib/utils';

type LiveMapPlaceholderProps = {
  title?: string;
  subtitle?: string;
  isEmergency?: boolean;
  etaMinutes?: number;
  providerName?: string;
  lat?: number;
  lng?: number;
  className?: string;
};

// Small filler "building" blocks scattered across city blocks — purely decorative,
// gives the base map texture instead of empty rectangles.
const BUILDINGS = [
  { x: 26, y: 66, w: 16, h: 12 }, { x: 46, y: 62, w: 12, h: 18 }, { x: 30, y: 128, w: 18, h: 14 },
  { x: 205, y: 30, w: 14, h: 16 }, { x: 224, y: 34, w: 18, h: 12 }, { x: 246, y: 28, w: 12, h: 20 },
  { x: 205, y: 128, w: 16, h: 14 }, { x: 226, y: 132, w: 14, h: 16 },
  { x: 300, y: 40, w: 16, h: 14 }, { x: 322, y: 44, w: 14, h: 12 },
  { x: 26, y: 210, w: 14, h: 16 }, { x: 46, y: 214, w: 16, h: 12 },
  { x: 300, y: 250, w: 14, h: 14 }, { x: 322, y: 252, w: 16, h: 12 },
];

export const LiveMapPlaceholder = ({
  title = 'Live GPS Location Tracking',
  subtitle = 'Real-time location active',
  isEmergency = false,
  etaMinutes = 10,
  providerName = 'Emergency Responder',
  lat,
  lng,
  className,
}: LiveMapPlaceholderProps) => {
  const coordsLabel = typeof lat === 'number' && typeof lng === 'number'
    ? `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`
    : null;

  return (
    <div className={cn('flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', isEmergency ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')}>
            {isEmergency ? <Siren className="h-4 w-4 animate-pulse" /> : <Compass className="h-4 w-4" />}
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-bold text-foreground">{title}</span>
            <span className="truncate text-2xs text-muted-foreground">{subtitle}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-2xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Live</span>
        </div>
      </div>

      {/* Map canvas — a square tile, like a real map */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#eef1e8] dark:bg-slate-800">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          {/* Terrain: park, water, sand lot */}
          <rect x="14" y="14" width="130" height="110" rx="10" className="fill-[#cfe8ca] dark:fill-emerald-900/40" />
          <rect x="252" y="252" width="140" height="134" rx="14" className="fill-[#a9d6f5] dark:fill-sky-900/40" />
          <rect x="160" y="270" width="80" height="70" rx="8" className="fill-[#f0e5c9] dark:fill-amber-900/20" />

          {/* City blocks (buildings) for texture */}
          {BUILDINGS.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2" className="fill-[#d8d3c8] dark:fill-slate-600/70" />
          ))}

          {/* Minor streets */}
          {[70, 150, 230, 310].map((x) => (
            <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="400" className="stroke-white dark:stroke-slate-600" strokeWidth="7" />
          ))}
          {[65, 150, 235, 320].map((y) => (
            <line key={`h-${y}`} x1="0" y1={y} x2="400" y2={y} className="stroke-white dark:stroke-slate-600" strokeWidth="7" />
          ))}
          {/* Major avenues, on top of minor streets */}
          <line x1="0" y1="200" x2="400" y2="200" className="stroke-[#fbd97a] dark:stroke-amber-500/60" strokeWidth="12" />
          <line x1="190" y1="0" x2="190" y2="400" className="stroke-[#fbd97a] dark:stroke-amber-500/60" strokeWidth="12" />
          <line x1="0" y1="200" x2="400" y2="200" className="stroke-white/70 dark:stroke-white/10" strokeWidth="2" strokeDasharray="10 8" />
          <line x1="190" y1="0" x2="190" y2="400" className="stroke-white/70 dark:stroke-white/10" strokeWidth="2" strokeDasharray="10 8" />

          {/* Live route from home to responder */}
          <path
            d="M 70 285 Q 170 190 270 220 T 330 90"
            className="stroke-primary"
            strokeWidth="4"
            strokeDasharray="2 9"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Compass */}
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/90 shadow-xs backdrop-blur-sm">
          <span className="relative flex h-4 w-4 items-center justify-center text-2xs font-black text-destructive">N</span>
        </div>

        {/* Origin Pin (Home) */}
        <div className="absolute left-[16%] top-[70%] flex flex-col items-center gap-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15">
            <MapPin className="h-4 w-4" />
          </span>
          <span className="rounded-md border border-border bg-card px-2 py-0.5 text-2xs font-semibold text-foreground shadow-xs">
            Home
          </span>
        </div>

        {/* Moving Responder Pin */}
        <div className="absolute right-[16%] top-[20%] flex flex-col items-center gap-1.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md">
            <span className="absolute -inset-2 animate-ping rounded-full bg-secondary/30" />
            <Navigation className="h-5 w-5 rotate-45" />
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-2xs font-bold text-secondary-foreground shadow-xs">
            {providerName} · ~{etaMinutes} min
          </span>
        </div>
      </div>

      {/* Footer status bar */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-surface/60 px-4 py-3">
        <span className="flex min-w-0 items-center gap-1.5 truncate text-2xs text-muted-foreground">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          {coordsLabel ? `GPS stream connected · ${coordsLabel}` : 'GPS stream connected'}
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-primary">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-sm font-black">{etaMinutes} min ETA</span>
        </span>
      </div>
    </div>
  );
};

export default LiveMapPlaceholder;
