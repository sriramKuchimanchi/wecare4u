import { NavLink } from 'react-router-dom';
import { icons, type IconName } from '@/config/icons';
import { getNavConfig, type NavSection } from '@/config/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

const AiAssistantLink = ({ onNavigate, pinBottom }: { onNavigate?: () => void; pinBottom?: boolean }) => (
  <NavLink
    to="/portal/family/ai-assistant"
    onClick={onNavigate}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-sm font-medium transition-colors',
        pinBottom && 'mt-auto',
        isActive ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10',
      )
    }
  >
    <icons.Bot className="h-4 w-4 shrink-0" />
    <span className="flex-1">AI Assistant</span>
  </NavLink>
);

type PortalSidebarProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
  role?: UserRole;
  className?: string;
  /** Pin the AI Assistant link to the bottom (desktop panel). Mobile drawer omits this so the link stays in-flow, below the bottom nav bar's overlap zone. */
  pinAiAssistant?: boolean;
};

const SectionBlock = ({ section, onNavigate }: { section: NavSection; onNavigate?: () => void }) => (
  <div className="flex flex-col gap-1">
    {section.label && (
      <p className="px-3 pb-1 pt-3 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
        {section.label}
      </p>
    )}
    {section.items.map((item) => {
      const Icon = icons[item.icon as IconName] ?? icons.CircleDot;
      return (
        <NavLink
          key={item.id}
          to={item.path}
          onClick={onNavigate}
          end
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-2xs font-bold text-secondary-foreground">
              {item.badge}
            </span>
          )}
        </NavLink>
      );
    })}
  </div>
);

export const PortalSidebar = ({ onNavigate, role: routeRole, className, pinAiAssistant = false }: PortalSidebarProps) => {
  const { role: authRole } = useAuth();
  const role = routeRole ?? authRole ?? 'family';
  const config = getNavConfig(role);

  return (
    <aside className={cn('flex h-full w-full flex-col overflow-y-auto bg-surface p-4', className)}>
      <nav className={cn('flex flex-col gap-2', pinAiAssistant && 'flex-1')}>
        {config.sections.map((section) => (
          <SectionBlock key={section.id} section={section} onNavigate={onNavigate} />
        ))}
        {role === 'family' && <AiAssistantLink onNavigate={onNavigate} pinBottom={pinAiAssistant} />}
      </nav>
    </aside>
  );
};

export default PortalSidebar;
