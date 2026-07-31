import { useLocation } from 'react-router-dom';
import { FamilyHomePage } from './family/family-home-page';
import { FamilyMembersPage } from './family/family-members-page';
import { FamilyMemberFormPage } from './family/family-member-form-page';
import { FamilyMemberProfilePage } from './family/family-member-profile-page';
import { RequestCarePage } from './family/request-care-page';
import { CareProviderProfilePage } from './family/care-provider-profile-page';
import { FamilyTimelinePage } from './family/family-timeline-page';
import { FamilyNotificationsPage } from './family/family-notifications-page';
import { FamilyProfilePage } from './family/family-profile-page';
import { FamilySearchPage } from './family/family-search-page';
import { FamilyAppointmentsPage } from './family/family-appointments-page';
import { PortalPage } from './portal-page';
import type { UserRole } from '@/types';

/**
 * Renders the correct portal page based on role + pathname.
 * The router mounts this at /portal/:role/* and we resolve the sub-page here.
 */
export const PortalRouter = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const role = (segments[1] as UserRole) ?? 'family';
  const sub = segments.slice(2); // e.g. ['members', 'mem_1']

  if (role === 'family') {
    return <FamilyPortalRouter sub={sub} />;
  }

  // Other roles still show the placeholder
  return <PortalPage />;
};

const FamilyPortalRouter = ({ sub }: { sub: string[] }) => {
  const [first, second, third] = sub;

  // Home (no sub-segments)
  if (!first) return <FamilyHomePage />;

  // /request-care
  if (first === 'request-care') {
    if (second) return <CareProviderProfilePage />;
    return <RequestCarePage />;
  }

  // /members
  if (first === 'members') {
    if (second === 'new') return <FamilyMemberFormPage />;
    if (second && third === 'edit') return <FamilyMemberFormPage />;
    if (second) return <FamilyMemberProfilePage />;
    return <FamilyMembersPage />;
  }

  // /timeline
  if (first === 'timeline') return <FamilyTimelinePage />;

  // /notifications
  if (first === 'notifications') return <FamilyNotificationsPage />;

  // /profile
  if (first === 'profile') return <FamilyProfilePage />;

  // /search
  if (first === 'search') return <FamilySearchPage />;

  // /appointments
  if (first === 'appointments') return <FamilyAppointmentsPage />;

  // fallback
  return <FamilyHomePage />;
};

export default PortalRouter;
