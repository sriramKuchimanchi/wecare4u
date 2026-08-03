import { Link } from 'react-router-dom';
import { Activity, Ambulance, ArrowRight, Bell, Brain, Building2, Calendar, Car, CheckCircle2, ChevronDown, ChevronRight, Clock, Droplet, Dumbbell, FileText, FlaskConical, Heart, HeartHandshake, HeartPulse, Home, Lock, MapPin, MessageCircle, MessageSquare, Pill, Scan, ShieldAlert, ShieldCheck, Siren, Sparkles, Stethoscope, TestTube, Users, Video, Wrench, Zap, type LucideIcon } from '@/config/icons';
import { icons, type IconName } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { APP_NAME, APP_TAGLINE } from '@/constants';
import { useAdminCategoriesQuery } from '@/hooks/use-portal-queries';

const journey: [LucideIcon, string, string, string][] = [
  [Users, '01', 'Create family', 'Bring your family circle together and add the details that help us care well.'],
  [HeartHandshake, '02', 'Request care', 'Find trusted providers and book exactly what your loved one needs.'],
  [Activity, '03', 'Track everything', 'See appointments, updates, records and progress without chasing anyone.'],
];

const platform: [LucideIcon, string, string][] = [
  [FileText, 'Medical records', 'Important history, safely organized.'],
  [Bell, 'Smart notifications', 'Never miss a meaningful update.'],
  [MapPin, 'Live coordination', 'Know where care stands, at a glance.'],
  [MessageSquare, 'Human support', 'A real team behind the technology.'],
];

const familyBenefits = ['Care timeline', 'Medical records', 'Appointments', 'AI guidance', 'Emergency support', 'Notifications'];
const providerBenefits = ['Bookings', 'Employees', 'Availability', 'Schedules', 'Analytics', 'Reviews'];
const clientLogos = [
  'Apollo Hospitals',
  'KIMS Hospitals',
  'Fortis Healthcare',
  'Aster',
  'Narayana Health',
  'Manipal Hospitals',
];

const Benefits = ({ items }: { items: string[] }) => <ul className="grid grid-cols-2 gap-x-4 gap-y-3">{items.map((item) => <li key={item} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-secondary" />{item}</li>)}</ul>;
const SectionLabel = ({ children }: { children: React.ReactNode }) => <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">{children}</p>;

export const LandingPage = () => {
  const { data: categories = [], isLoading } = useAdminCategoriesQuery();
  const enabledCategories = categories.filter((c: any) => c.enabled !== false);

  return (
    <div className="landing-page overflow-hidden bg-[#fffaf4] text-[#10243e]">
      <section className="landing-hero relative overflow-hidden bg-[#10243e]">
        <div className="absolute inset-0 bg-[url('/hero2.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,31,60,0.9)_0%,rgba(7,31,60,0.78)_48%,rgba(7,31,60,0.42)_100%)]" />
        <div className="container relative grid min-h-[520px] items-center py-10 lg:py-14">
          <div className="relative z-10 flex max-w-3xl flex-col items-start gap-6">
            <h1 className="font-serif text-5xl font-bold leading-[0.98] tracking-tight text-white md:text-6xl lg:text-[4.7rem]">Peace of mind for <span className="text-[#f26a22]">families</span><br />Complete care for parents</h1>
            <p className="max-w-2xl text-base leading-7 text-white/85 md:text-lg">A calmer way to care for the people you love. Connect healthcare, home support, emergency response and every important update in one trusted place.</p>
            <div className="flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" className="h-13 rounded-xl bg-[#f26a22] px-7 text-white shadow-lg shadow-[#f26a22]/25 hover:bg-[#e05f18]"><Link to="/register">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline" className="h-13 rounded-xl border-white/30 bg-white/85 px-7 text-[#10243e] hover:bg-white"><Link to="/#services">Explore services <ChevronRight className="ml-1 h-4 w-4" /></Link></Button></div>
            <p className="text-sm text-white/90"><strong className="text-white">10,000+ families</strong> coordinate care with confidence</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e7ddd2] py-8"><div className="container grid gap-6 text-center sm:grid-cols-4 sm:text-left"><div><p className="font-serif text-3xl font-bold text-secondary">24/7</p><p className="text-xs uppercase tracking-[0.14em] text-[#718096]">Support when needed</p></div><div><p className="font-serif text-3xl font-bold">1.5k+</p><p className="text-xs uppercase tracking-[0.14em] text-[#718096]">Verified providers</p></div><div><p className="font-serif text-3xl font-bold">4.9/5</p><p className="text-xs uppercase tracking-[0.14em] text-[#718096]">Family rating</p></div><div><p className="font-serif text-3xl font-bold">One app</p><p className="text-xs uppercase tracking-[0.14em] text-[#718096]">For every care moment</p></div></div></section>

      <section className="border-b border-[#243b59] bg-[#10243e] py-14 text-white md:py-16"><div className="container"><div className="grid items-end gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f5a06a]"><Building2 className="h-4 w-4" /> Care, trusted across India</div><h2 className="max-w-xl font-serif text-4xl font-bold leading-tight md:text-5xl">The care network<br /><span className="text-[#f5a06a]">families can count on.</span></h2><p className="mt-4 max-w-md text-sm leading-6 text-white/65">Designed to bring families, hospitals, clinicians and home-care teams into one clear circle of support.</p></div><div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">{clientLogos.map((client) => <div key={client} className="group flex min-h-[84px] flex-col justify-center rounded-xl border border-white/10 bg-white/[0.07] px-3 py-3 text-center transition-all hover:-translate-y-0.5 hover:border-[#f5a06a]/60 hover:bg-white/10"><span className="text-[0.95rem] font-black tracking-[0.04em] text-white/90 group-hover:text-[#f5a06a] sm:text-lg">{client}</span></div>)}</div></div><div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-5 text-xs text-white/55"><span><strong className="text-white">6</strong> care networks featured</span><span><strong className="text-white">24/7</strong> coordination ready</span><span><strong className="text-white">One view</strong> for every family</span></div></div></section>

      <section id="services" className="container py-16 md:py-20">
        <div className="mb-9 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div><SectionLabel>Care, connected</SectionLabel><h2 className="font-serif text-4xl font-bold md:text-5xl">Everything they need<br /><span className="text-secondary">All in one place</span></h2></div>
        </div>
        
        {isLoading ? (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-[#eadfd4] bg-white p-4" />
            ))}
          </div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {enabledCategories.map((cat: any) => {
              const Icon = (icons[cat.icon as IconName] ?? icons.Stethoscope) as LucideIcon;
              const items: any[] = cat.items ?? [];
              return (
                <div key={cat.id || cat.name} className="group relative outline-none">
                  <Link to="/portal/family/request-care" className="relative z-10 flex items-center gap-3 rounded-xl border border-[#eadfd4] bg-white px-3.5 py-3 transition-all duration-300 group-hover:border-secondary/50 group-hover:shadow-[0_14px_30px_-18px_rgba(16,36,62,0.35)] group-focus-within:border-secondary/50 group-focus-within:shadow-[0_14px_30px_-18px_rgba(16,36,62,0.35)]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fceddf] text-secondary transition-colors duration-300 group-hover:bg-secondary group-hover:text-white group-focus-within:bg-secondary group-focus-within:text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[0.85rem] font-semibold leading-tight">{cat.name}</h3>
                      <p className="mt-0.5 truncate text-[11px] leading-tight text-[#94a3b3]">{cat.description}</p>
                    </div>
                    {items.length > 0 && (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#c3ccd4] transition-transform duration-300 group-hover:rotate-180 group-hover:text-secondary group-focus-within:rotate-180 group-focus-within:text-secondary" />
                    )}
                  </Link>

                  {items.length > 0 && (
                    <div className="invisible absolute inset-x-0 top-full z-30 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#10243e] shadow-2xl shadow-black/30 ring-1 ring-secondary/20">
                        <div className="h-[3px] w-full bg-gradient-to-r from-secondary via-[#f5a06a] to-secondary" />
                        <ul className="divide-y divide-white/5 p-1.5">
                          {items.map((item: any) => {
                            const ItemIcon = (icons[item.icon as IconName] ?? icons.CheckCircle2) as LucideIcon;
                            return (
                              <li key={item.name}>
                                <Link to="/portal/family/request-care" className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-white/80 transition-colors hover:bg-white/5 hover:text-white">
                                  <ItemIcon className="h-3.5 w-3.5 shrink-0 text-[#f5a06a]" />
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section id="how-it-works" className="bg-[#eef3f1] py-16 md:py-20"><div className="container"><div className="mx-auto mb-10 max-w-xl text-center"><SectionLabel>A simpler journey</SectionLabel><h2 className="font-serif text-4xl font-bold md:text-5xl">Care that moves with you</h2></div><div className="grid gap-5 md:grid-cols-3">{journey.map(([Icon, step, title, body]) => <div key={step} className="relative rounded-2xl bg-white p-6 shadow-sm"><span className="font-serif text-5xl font-bold text-[#d5e2df]">{step}</span><span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f1ee] text-[#28736d]"><Icon className="h-5 w-5" /></span><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#718096]">{body}</p></div>)}</div></div></section>

      <section id="ai" className="container py-16 md:py-20"><div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]"><div><span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fceddf] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-secondary"><Brain className="h-4 w-4" /> AI care companion</span><h2 className="font-serif text-4xl font-bold md:text-5xl">A little more clarity<br /><span className="text-secondary">A lot less worry</span></h2><p className="mt-5 max-w-md text-sm leading-7 text-[#718096]">Your care companion brings reminders, patterns and thoughtful next steps forward, so families can spend more time being present.</p><ul className="mt-6 space-y-3 text-sm"><li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-secondary" />Medication reminders that arrive on time</li><li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-secondary" />Health insights from the care timeline</li><li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-secondary" />Simple summaries for every appointment</li></ul></div><div className="rounded-[2rem] bg-[#10243e] p-5 text-white shadow-2xl md:p-7"><div className="flex items-center justify-between border-b border-white/10 pb-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary"><Sparkles className="h-5 w-5" /></span><div><p className="text-sm font-semibold">AI care companion</p><p className="text-xs text-white/50">Private support for your family</p></div></div><span className="flex items-center gap-1.5 text-xs text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Ready to help</span></div><div className="space-y-4 py-6"><div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-white/10 p-3 text-xs leading-5 text-white/80">Can you summarize Dad's care this week?</div><div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-[#f7eee6] p-4 text-xs leading-5 text-[#10243e]"><p className="mb-3 font-semibold">Here is the week at a glance</p><div className="space-y-2 text-[#53657b]"><p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-secondary" />2 appointments completed</p><p className="flex items-center gap-2"><Pill className="h-3.5 w-3.5 text-secondary" />7 medication reminders completed</p><p className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-secondary" />Vitals are stable and trending well</p></div></div></div><div className="flex flex-wrap gap-2 border-t border-white/10 pt-4"><span className="rounded-full border border-white/15 px-3 py-2 text-[11px] text-white/70">Set reminder</span><span className="rounded-full border border-white/15 px-3 py-2 text-[11px] text-white/70">View timeline</span><span className="rounded-full border border-white/15 px-3 py-2 text-[11px] text-white/70">Review insights</span></div></div></div></section>

      <section id="chat-assist" className="container pb-16 md:pb-20">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-[#eadfd4] bg-white shadow-lg">
          <div className="relative flex flex-col justify-center p-8 md:p-10">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#e7f6ec] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1f9e57]"><MessageCircle className="h-4 w-4" /> WhatsApp assistant</span>
            <h3 className="font-serif text-2xl font-bold leading-tight md:text-3xl">Care answers, right in your WhatsApp</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#718096]">Book a visit, check an appointment or reach the family circle &mdash; no new app to open, no waiting on hold.</p>
            <a href="#" className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-[#1f9e57]">Message us on WhatsApp <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section id="emergency" className="bg-[#fff0ee] py-16 md:py-20"><div className="container grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]"><div><span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fbd8d4] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-destructive"><Siren className="h-4 w-4" /> Emergency SOS</span><h2 className="font-serif text-4xl font-bold md:text-5xl">When seconds matter,<br /><span className="text-destructive">help is one tap away</span></h2><p className="mt-5 max-w-md text-sm leading-7 text-[#718096]">Alert your chosen family circle and coordinated responders with a clear location, context and live response status.</p><Button asChild size="lg" variant="destructive" className="mt-6 h-13 rounded-xl px-7"><Link to="/register">Set up emergency contacts <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div><div className="rounded-[2rem] border border-[#f5d5d0] bg-white p-5 shadow-lg md:p-7"><div className="mb-5 flex items-center justify-between"><div><p className="text-sm font-semibold">Emergency preview</p><p className="text-xs text-[#718096]">Choose who to alert</p></div><ShieldCheck className="h-6 w-6 text-emerald-500" /></div>{['Maya - Daughter', 'Raghav - Son', 'Care coordinator'].map((name, index) => <div key={name} className="mb-3 flex items-center gap-3 rounded-xl border border-[#edf0f1] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fceddf] text-secondary"><Users className="h-4 w-4" /></span><span className="flex-1 text-sm font-medium">{name}</span><span className={index < 2 ? 'h-5 w-5 rounded-md border-2 border-secondary bg-secondary' : 'h-5 w-5 rounded-md border-2 border-[#d7dde2]'}>{index < 2 && <CheckCircle2 className="h-4 w-4 text-white" />}</span></div>)}<div className="mt-5 flex items-center gap-3 rounded-xl bg-[#fff0ee] p-3 text-xs text-destructive"><Clock className="h-4 w-4" /><span><strong>Response timeline</strong><br />Alert sent - Help coordinating - Family notified</span></div></div></div></section>

      <section id="families" className="container py-16 md:py-20"><div className="grid gap-5 lg:grid-cols-2"><div className="rounded-[2rem] bg-[#f7eee6] p-7 md:p-10"><span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-secondary"><Heart className="h-4 w-4" /> For families</span><h2 className="font-serif text-4xl font-bold">Feel close, even<br />when you are far away</h2><p className="mt-4 max-w-md text-sm leading-6 text-[#718096]">One shared view of the details that matter, made for busy families and the people they care for.</p><div className="mt-7"><Benefits items={familyBenefits} /></div><Link to="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-secondary">Create family account <ArrowRight className="h-4 w-4" /></Link></div><div id="providers" className="rounded-[2rem] bg-[#e9f1f1] p-7 md:p-10"><span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#28736d]"><Stethoscope className="h-4 w-4" /> For providers</span><h2 className="font-serif text-4xl font-bold">More time for care<br />Less time coordinating</h2><p className="mt-4 max-w-md text-sm leading-6 text-[#718096]">Tools that help your team stay organized, responsive and focused on the people who count on you.</p><div className="mt-7"><Benefits items={providerBenefits} /></div><Link to="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#28736d]">Join our provider network <ArrowRight className="h-4 w-4" /></Link></div></div></section>

      <section className="border-y border-[#e7ddd2] bg-white py-14"><div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><SectionLabel>One connected platform</SectionLabel><h2 className="font-serif text-4xl font-bold">Every update, right<br />where it belongs</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#718096]">A clear, shared record helps families, caregivers and providers move together.</p></div><div className="grid gap-3 sm:grid-cols-2">{platform.map(([Icon, title, body]) => <div key={title} className="rounded-2xl border border-[#eadfd4] p-5"><Icon className="h-5 w-5 text-secondary" /><p className="mt-4 text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-[#718096]">{body}</p></div>)}</div></div></section>

      <section className="bg-[#10243e] py-16 text-white md:py-20"><div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div><SectionLabel>Care starts here</SectionLabel><h2 className="max-w-2xl font-serif text-4xl font-bold leading-tight md:text-6xl">Give your family<br />more good days</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/65">{APP_TAGLINE}. A trusted circle of care for every season of life.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" className="h-13 rounded-xl bg-secondary px-7 text-white"><Link to="/register">Get started today <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline" className="h-13 rounded-xl border-white/25 bg-white/5 px-7 text-white"><Link to="/login">Login</Link></Button></div></div></section>

      <section className="container flex flex-col items-center gap-3 py-14 text-center"><SectionLabel>Built around trust</SectionLabel><h2 className="font-serif text-3xl font-bold">Care is personal and your tools should be too</h2><p className="max-w-xl text-sm leading-6 text-[#718096]">{APP_NAME} brings the warmth of a care circle to the clarity of one connected platform.</p><div className="mt-3 flex flex-wrap justify-center gap-5 text-xs text-[#718096]"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified providers</span><span className="flex items-center gap-2"><Lock className="h-4 w-4 text-emerald-500" /> Private by design</span><span className="flex items-center gap-2"><Video className="h-4 w-4 text-emerald-500" /> Human support</span></div></section>
    </div>
  );
};

export default LandingPage;