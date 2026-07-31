import { NavLink } from 'react-router-dom';
import { icons, type IconName } from '@/config/icons';
import { getNavConfig, type NavSection } from '@/config/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

type PortalSidebarProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
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

export const PortalSidebar = ({ onNavigate, className }: PortalSidebarProps) => {
  const { role } = useAuth();
  const config = getNavConfig(role ?? 'family');

  return (
    <aside className={cn('flex h-full w-full flex-col overflow-y-auto bg-surface p-3', className)}>
      <nav className="flex flex-col gap-2">
        {config.sections.map((section) => (
          <SectionBlock key={section.id} section={section} onNavigate={onNavigate} />
        ))}
      </nav>
    </aside>
  );
};

export default PortalSidebar;
