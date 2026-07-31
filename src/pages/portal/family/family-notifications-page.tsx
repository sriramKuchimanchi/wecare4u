import { useState } from 'react';
import { Bell, CheckCheck, Trash2, Filter } from '@/config/icons';
import { PageHeader, EmptyState, NotificationItem } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/skeleton';
import {
  useNotifications, useMarkNotificationReadMutation, useMarkAllReadMutation, useRemoveNotificationMutation,
} from '@/hooks/use-family-portal';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';

type FilterKey = 'all' | 'unread' | 'read';

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
];

const toneIconMap: Record<string, typeof Bell> = {
  info: Bell,
  success: Bell,
  warning: Bell,
  error: Bell,
};

export const FamilyNotificationsPage = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllReadMutation();
  const removeNotif = useRemoveNotificationMutation();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => filter === 'unread' ? !n.read : n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Stay informed about every care event"
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} className="gap-1.5">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          ) : undefined
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70',
            )}
          >
            {tab.label}
            {tab.key === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-secondary px-1.5 py-0.5 text-2xs font-bold text-secondary-foreground">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            description="You're all caught up. New alerts will appear here."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((notif: Notification) => (
            <Card key={notif.id} className="flex items-stretch p-0">
              <div className="flex flex-1">
                <NotificationItem
                  title={notif.title}
                  message={notif.message}
                  timestamp={notif.createdAt}
                  read={notif.read}
                  tone={notif.type as any}
                  icon={toneIconMap[notif.type]}
                  onClick={() => { if (!notif.read) markRead.mutate(notif.id); }}
                />
              </div>
              <div className="flex items-center gap-1 border-l border-border px-2">
                {!notif.read && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markRead.mutate(notif.id)} aria-label="Mark as read">
                    <CheckCheck className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeNotif.mutate(notif.id)} aria-label="Delete notification">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyNotificationsPage;
