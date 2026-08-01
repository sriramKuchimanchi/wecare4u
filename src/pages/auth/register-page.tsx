import { Link } from 'react-router-dom';
import { Heart, Briefcase, ArrowRight } from '@/config/icons';
import { AuthLayout } from '@/layouts';

const choices = [
  {
    role: 'family' as const,
    title: 'Family',
    description: 'Coordinate care for your loved ones — bookings, medical records, emergency response and more.',
    icon: Heart,
    to: '/register/family',
  },
  {
    role: 'care-provider' as const,
    title: 'Service Provider',
    description: 'Register as an individual professional or an organization to offer care services.',
    icon: Briefcase,
    to: '/register/care-provider',
  },
];

export const RegisterPage = () => (
  <AuthLayout
    title="Create your account"
    subtitle="Choose your account type to get started."
    footer={
      <>
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
      </>
    }
  >
    <div className="flex flex-col gap-3">
      {choices.map((choice) => (
        <Link
          key={choice.role}
          to={choice.to}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-primary hover:shadow-soft"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <choice.icon className="h-5 w-5" />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-foreground">{choice.title}</span>
            <span className="text-xs text-muted-foreground">{choice.description}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
    </div>
  </AuthLayout>
);

export default RegisterPage;
