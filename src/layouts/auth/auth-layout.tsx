import { Link } from 'react-router-dom';
import { ArrowLeft, HeartPulse } from '@/config/icons';
import { APP_NAME, APP_TAGLINE } from '@/constants';

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Split-screen authentication layout.
 * Left panel: brand + value proposition.
 * Right panel: form content supplied by the page.
 */
export const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => (
  <div className="flex min-h-dvh flex-col bg-background md:flex-row">
    {/* Brand panel */}
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex md:w-1/2 lg:p-16">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 35%)' }} />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />
      <Link to="/" className="relative flex items-center gap-2.5">
        <img src="/logo.png" alt="We Care For You" className="h-12 w-12 rounded-xl object-contain" />
        <span className="text-lg font-bold">{APP_NAME}</span>
      </Link>
      <div className="relative flex flex-col gap-4">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
            <HeartPulse className="h-6 w-6" />
          </div>
          <h2 className="max-w-md font-serif text-3xl font-bold leading-tight lg:text-5xl">
          Care that feels like family.
        </h2>
        <p className="max-w-md text-sm text-primary-foreground/80 lg:text-base">
          {APP_TAGLINE}. Coordinate healthcare, emergency response, home care, pharmacy, laboratory and transport — all in one place.
        </p>
      </div>
      <p className="relative text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {APP_NAME}
      </p>
    </aside>

    {/* Form panel */}
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between p-4 md:hidden">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="We Care For You" className="h-8 w-8 object-contain" />
          <span className="text-sm font-bold text-foreground">{APP_NAME}</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="flex flex-col gap-1 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
