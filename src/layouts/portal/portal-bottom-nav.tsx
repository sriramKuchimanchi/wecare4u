import { NavLink } from 'react-router-dom';
import { icons, type IconName } from '@/config/icons';
import { getBottomNavItems } from '@/config/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

/**
 * Mobile bottom navigation bar.
 * Renders the first few top-level items for the active role.
 */
export const PortalBottomNav = () => {
  const { role } = useAuth();
  const items = getBottomNavItems(role ?? 'family');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-header flex items-stretch justify-around border-t border-border bg-surface/95 backdrop-blur-md safe-bottom md:hidden">
      {items.map((item) => {
        const Icon = icons[item.icon as IconName] ?? icons.CircleDot;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            end
            className={({ isActive }) =>
              cn(
                'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-2xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
                <Icon className="h-5 w-5" />
                <span className="max-w-[64px] truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default PortalBottomNav;
