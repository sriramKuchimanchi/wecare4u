import { Link } from 'react-router-dom';
import {
  Heart, ArrowRight, Shield, Stethoscope, Ambulance, Pill, FlaskConical, Car,
  Calendar, Bell, Activity, Sparkles, CheckCircle, Siren, Brain, Users, Phone,
  Star, ChevronDown,
} from '@/config/icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '@/constants';
import { cn } from '@/lib/utils';

const services = [
  { icon: Stethoscope, title: 'Home Care', description: 'Verified caregivers for daily living support.' },
  { icon: Ambulance, title: 'Emergency Response', description: 'One-tap dispatch to coordinated responders.' },
  { icon: Pill, title: 'Pharmacy', description: 'Medication delivery and refill management.' },
  { icon: FlaskConical, title: 'Laboratory', description: 'At-home sample collection and results.' },
  { icon: Car, title: 'Transport', description: 'Safe rides to appointments and errands.' },
  { icon: Calendar, title: 'Bookings', description: 'Schedule and coordinate every service.' },
];

const stats = [
  { value: '10k+', label: 'Families served' },
  { value: '1.5k+', label: 'Verified providers' },
  { value: '24/7', label: 'Emergency support' },
  { value: '4.9★', label: 'Average rating' },
];

const howItWorks = [
  { step: '01', title: 'Create your family', description: 'Sign up and add your family members with their care needs.' },
  { step: '02', title: 'Choose verified providers', description: 'Browse verified care providers for every service your family needs.' },
  { step: '03', title: 'Coordinate & track', description: 'Book services, track every event on the timeline, and respond to emergencies.' },
];

const testimonials = [
  { name: 'Aisha R.', role: 'Family caregiver', quote: 'We Care For You gave me peace of mind. I can track my mother\'s care from anywhere.', rating: 5 },
  { name: 'Dr. Omar H.', role: 'Home care provider', quote: 'The platform helps me manage bookings and staff effortlessly. Families trust the verified badge.', rating: 5 },
  { name: 'Layla N.', role: 'Registered nurse', quote: 'My schedule and patient notes are always with me. It feels built for how I actually work.', rating: 4 },
];

const faqs = [
  { q: 'How do I know providers are verified?', a: 'Every care provider on the platform undergoes an admin verification process before their account becomes active. You will only see verified providers.' },
  { q: 'Can I use the app for emergency response?', a: 'Yes. The Emergency SOS feature lets you dispatch coordinated responders with a single tap, available 24/7.' },
  { q: 'Which services are available?', a: 'Home care, nursing, physiotherapy, pharmacy delivery, laboratory sample collection, transport, medical visits and emergency response.' },
  { q: 'Is my family\'s data private?', a: 'Your data is encrypted and only shared with the providers you choose. We never sell your information.' },
  { q: 'Does it work on mobile?', a: 'Yes. The platform is a Progressive Web App — installable on any phone, with offline support.' },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-foreground md:text-base">{q}</span>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground">{a}</p>}
    </div>
  );
};

export const LandingPage = () => (
  <div className="flex flex-col">
    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.04] to-background">
      <div className="container flex flex-col items-center gap-8 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            AI-Powered Care Coordination
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Care that feels like <span className="text-primary">family</span>.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            {APP_DESCRIPTION}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/register">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface p-4 text-center">
              <span className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</span>
              <span className="text-xs text-muted-foreground md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="container py-16 md:py-24">
      <div className="flex flex-col items-center gap-3 pb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">How it works</h2>
        <p className="max-w-xl text-muted-foreground">Three simple steps to coordinated, confident care.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {howItWorks.map((item) => (
          <div key={item.step} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
            <span className="text-3xl font-bold text-primary/30">{item.step}</span>
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Services */}
    <section id="services" className="border-y border-border bg-surface">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col items-center gap-3 pb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Everything your family needs</h2>
          <p className="max-w-xl text-muted-foreground">One platform to coordinate healthcare, emergency response, home care, pharmacy, laboratory and transport.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <service.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* AI Assistant */}
    <section id="ai" className="container py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
            <Brain className="h-3.5 w-3.5" /> AI Assistant
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Care guidance, powered by AI</h2>
          <p className="text-muted-foreground">Get personalized care suggestions, summarize your family\'s care timeline, and surface the right next step — all tuned for senior care.</p>
          <ul className="flex flex-col gap-2">
            {['Smart care suggestions', 'Timeline summaries', 'Medication reminders', '24/7 assistance'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-success" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-secondary" /> AI suggestion
          </div>
          <p className="text-sm text-muted-foreground">"Based on your father\'s recent blood pressure readings, a follow-up nursing visit within 48 hours is recommended. Would you like to book one?"</p>
          <div className="flex gap-2">
            <Button size="sm">Book a visit</Button>
            <Button size="sm" variant="outline">Ask the AI</Button>
          </div>
        </div>
      </div>
    </section>

    {/* Emergency SOS */}
    <section id="emergency" className="border-y border-border bg-destructive/[0.04]">
      <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            <Siren className="h-3.5 w-3.5" /> Emergency SOS
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">One tap to help</h2>
          <p className="text-muted-foreground">When seconds matter, the Emergency SOS feature dispatches coordinated responders to your family\'s location instantly. Share live status with loved ones until help arrives.</p>
          <Button asChild variant="destructive" className="w-fit">
            <Link to="/register">Set up emergency contacts <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="flex justify-center">
          <div className="flex h-48 w-48 items-center justify-center rounded-full bg-destructive/10">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-destructive text-white shadow-floating">
              <Siren className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Request Care */}
    <section id="request-care" className="container py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="order-2 flex justify-center md:order-1">
          <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-card">
            {[
              { icon: Stethoscope, label: 'Home care visit' },
              { icon: Pill, label: 'Pharmacy delivery' },
              { icon: FlaskConical, label: 'Lab sample collection' },
              { icon: Car, label: 'Transport to appointment' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                <row.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{row.label}</span>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 flex flex-col gap-4 md:order-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Phone className="h-3.5 w-3.5" /> Request Care
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Request any service, anytime</h2>
          <p className="text-muted-foreground">From a nursing visit to a pharmacy refill, request exactly what your family needs. Coordinate every booking in one place and track each step until it\'s done.</p>
          <Button asChild className="w-fit">
            <Link to="/register">Request care <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Value props */}
    <section id="families" className="border-y border-border bg-surface">
      <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Heart className="h-3.5 w-3.5" /> For Families
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Peace of mind, every day</h2>
          <p className="text-muted-foreground">Coordinate care for your loved ones with confidence. Track every appointment, medication and emergency response in a single timeline.</p>
          <ul className="flex flex-col gap-2">
            {['Real-time care timeline', 'Verified providers only', 'Family member profiles', 'Medical records in one place'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-success" /> {item}
              </li>
            ))}
          </ul>
          <Button asChild className="w-fit">
            <Link to="/register">Create family account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
            <Shield className="h-3.5 w-3.5" /> For Providers
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Grow your care business</h2>
          <p className="text-muted-foreground">Reach families who need your services. Manage bookings, staff and schedules with tools built for care providers.</p>
          <ul className="flex flex-col gap-2">
            {['Booking management', 'Staff scheduling', 'Patient coordination', 'Verified provider badge'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-success" /> {item}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="w-fit">
            <Link to="/register">Register as provider <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Feature highlights */}
    <section className="container py-16 md:py-24">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Bell, title: 'Smart Notifications', description: 'Stay informed about every care event, appointment update and emergency alert.' },
          { icon: Activity, title: 'Care Timeline', description: 'A chronological view of every action taken for your family members.' },
          { icon: Users, title: 'Family Profiles', description: 'Keep medical records and care needs for every family member in one place.' },
        ].map((feature) => (
          <div key={feature.title} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
            <feature.icon className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section id="testimonials" className="border-y border-border bg-surface">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col items-center gap-3 pb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Families and providers trust us</h2>
          <p className="max-w-xl text-muted-foreground">Real stories from the people who use {APP_NAME} every day.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('h-4 w-4', i < t.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground/30')} />
                ))}
              </div>
              <blockquote className="text-sm text-foreground">"{t.quote}"</blockquote>
              <figcaption className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="container py-16 md:py-24">
      <div className="flex flex-col items-center gap-3 pb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Frequently asked questions</h2>
        <p className="max-w-xl text-muted-foreground">Everything you need to know about {APP_NAME}.</p>
      </div>
      <div className="mx-auto max-w-3xl">
        {faqs.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="container flex flex-col items-center gap-6 py-16 text-center md:py-24">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">{APP_NAME} starts with one step</h2>
        <p className="max-w-xl text-primary-foreground/80">{APP_TAGLINE}. Join thousands of families who trust us with care coordination.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Get started today <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" className="border border-white/40 bg-white/20 text-white hover:bg-white/30 font-semibold backdrop-blur-xs">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  </div>
);

export default LandingPage;
