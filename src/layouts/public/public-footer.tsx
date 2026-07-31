import { Link } from 'react-router-dom';
import { Heart, Mail, Phone } from '@/config/icons';
import { APP_NAME, APP_TAGLINE, SUPPORT_EMAIL, SUPPORT_PHONE } from '@/constants';

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Services', to: '/#services' },
      { label: 'For Families', to: '/#families' },
      { label: 'For Providers', to: '/#providers' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/register' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help center', to: '/#help' },
      { label: 'Privacy', to: '/#privacy' },
      { label: 'Terms', to: '/#terms' },
    ],
  },
];

export const PublicFooter = () => (
  <footer className="border-t border-border bg-surface safe-bottom">
    <div className="container py-12">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Heart className="h-5 w-5" />
            </span>
            <span className="text-base font-bold text-foreground">{APP_NAME}</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">{APP_TAGLINE}.</p>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
            </a>
            <a href={`tel:${SUPPORT_PHONE}`} className="flex items-center gap-2 hover:text-foreground">
              <Phone className="h-4 w-4" /> {SUPPORT_PHONE}
            </a>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 md:flex-row">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">Built with care for families everywhere.</p>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
