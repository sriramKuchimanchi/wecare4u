import { useLocation } from 'react-router-dom';
import { PortalPage } from './portal-page';
import type { UserRole } from '@/types';

// ─── Family Portal ────────────────────────────────────────────────────────────
import { FamilyHomePage } from './family/family-home-page';
import { FamilyMembersPage } from './family/family-members-page';
import { FamilyMemberFormPage } from './family/family-member-form-page';
import { FamilyMemberProfilePage } from './family/family-member-profile-page';
import { RequestCarePage } from './family/request-care-page';
import { CareProviderProfilePage } from './family/care-provider-profile-page';
import { CareRequestDetailPage } from './family/care-request-detail-page';
import { FamilyEmergencyPage } from './family/family-emergency-page';
import { EmergencyContactsPage } from './family/emergency-contacts-page';
import { AiAssistantPage } from './family/ai-assistant-page';
import { RecentRequestsPage } from './family/recent-requests-page';
import { FamilyTimelinePage } from './family/family-timeline-page';
import { FamilyNotificationsPage } from './family/family-notifications-page';
import { FamilyProfilePage } from './family/family-profile-page';
import { FamilyAppointmentsPage } from './family/family-appointments-page';

// ─── Service Provider Portal ──────────────────────────────────────────────────
import { CareProviderDashboard } from './care-provider/care-provider-dashboard';
import { CareRequestsListPage } from './care-provider/care-requests-list-page';
import { CareRequestDetailPage as ProviderCareRequestDetailPage } from './care-provider/care-request-detail-page';
import { EmployeeManagementPage } from './care-provider/employee-management-page';
import { EmployeeProfilePage } from './care-provider/employee-profile-page';
import { AvailabilityPage } from './care-provider/availability-page';
import { ServicesManagementPage } from './care-provider/services-management-page';
import { ReviewsPage } from './care-provider/reviews-page';
import { DocumentsPage } from './care-provider/documents-page';
import { OrganizationProfilePage } from './care-provider/organization-profile-page';
import { SchedulePage } from './care-provider/schedule-page';
import { ProviderSettingsPage } from './care-provider/provider-settings-page';

// ─── Employee Portal ───────────────────────────────────────────────────────────
import { EmployeeDashboard } from './employee/employee-dashboard';
import { EmployeeRequestDetailPage } from './employee/employee-request-detail-page';
import { EmployeeSchedulePage } from './employee/employee-schedule-page';
import { EmployeeAvailabilityPage } from './employee/employee-availability-page';
import { EmployeeNotificationsPage } from './employee/employee-notifications-page';
import { EmployeeSearchPage } from './employee/employee-search-page';

// ─── Administrator Portal ─────────────────────────────────────────────────────
import { AdminDashboard } from './admin/admin-dashboard';
import { FamiliesPage } from './admin/families-page';
import { FamilyDetailPage } from './admin/family-detail-page';
import { ProvidersPage } from './admin/providers-page';
import { ProviderDetailPage } from './admin/provider-detail-page';
import { AdminCareRequestsPage } from './admin/admin-care-requests-page';
import { EmergencyCenterPage } from './admin/emergency-center-page';
import { EmergencyDetailPage } from './admin/emergency-detail-page';
import { AdminNotificationsPage } from './admin/admin-notifications-page';
import { ServiceCategoriesPage } from './admin/service-categories-page';
import { PlatformTimelinePage } from './admin/platform-timeline-page';
import { AdminSettingsPage } from './admin/admin-settings-page';

/**
 * Renders the correct portal page based on role + pathname.
 * The router mounts this at /portal/:role/* and we resolve the sub-page here.
 */
export const PortalRouter = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const role = (segments[1] as UserRole) ?? 'family';
  const sub = segments.slice(2); // e.g. ['members', 'mem_1']

  if (role === 'family') return <FamilyPortalRouter sub={sub} />;
  if (role === 'care-provider') return <CareProviderPortalRouter sub={sub} />;
  if (role === 'employee') return <EmployeePortalRouter sub={sub} />;
  if (role === 'admin') return <AdminPortalRouter sub={sub} />;

  return <PortalPage />;
};

// ─────────────────────────────────────────────────────────────────────────────
const FamilyPortalRouter = ({ sub }: { sub: string[] }) => {
  const [first, second, third] = sub;

  if (!first) return <FamilyHomePage />;

  if (first === 'request-care') {
    if (second) return <CareProviderProfilePage />;
    return <RequestCarePage />;
  }

  if (first === 'care-requests') {
    if (second) return <CareRequestDetailPage />;
    return <RecentRequestsPage />;
  }

  if (first === 'recent-requests') return <RecentRequestsPage />;
  if (first === 'emergency') return <FamilyEmergencyPage />;
  if (first === 'emergency-contacts') return <EmergencyContactsPage />;
  if (first === 'ai-assistant' || first === 'assistant') return <AiAssistantPage />;

  if (first === 'members') {
    if (second === 'new') return <FamilyMemberFormPage />;
    if (second && third === 'edit') return <FamilyMemberFormPage />;
    if (second) return <FamilyMemberProfilePage />;
    return <FamilyMembersPage />;
  }

  if (first === 'timeline') return <FamilyTimelinePage />;
  if (first === 'notifications') return <FamilyNotificationsPage />;
  if (first === 'profile') return <FamilyProfilePage />;
  if (first === 'appointments') return <FamilyAppointmentsPage />;

  return <FamilyHomePage />;
};

// ─────────────────────────────────────────────────────────────────────────────
const CareProviderPortalRouter = ({ sub }: { sub: string[] }) => {
  const [first, second] = sub;

  if (!first) return <CareProviderDashboard />;

  if (first === 'requests') {
    if (second) return <ProviderCareRequestDetailPage />;
    return <CareRequestsListPage />;
  }

  if (first === 'employees') {
    if (second) return <EmployeeProfilePage />;
    return <EmployeeManagementPage />;
  }

  if (first === 'availability') return <AvailabilityPage />;
  if (first === 'services') return <ServicesManagementPage />;
  if (first === 'reviews') return <ReviewsPage />;
  if (first === 'documents') return <DocumentsPage />;
  if (first === 'organization' || first === 'profile') return <OrganizationProfilePage />;
  if (first === 'schedule') return <SchedulePage />;
  if (first === 'settings') return <ProviderSettingsPage />;

  return <CareProviderDashboard />;
};

// ─────────────────────────────────────────────────────────────────────────────
const EmployeePortalRouter = ({ sub }: { sub: string[] }) => {
  const [first, second] = sub;

  if (!first) return <EmployeeDashboard />;

  if (first === 'requests') {
    if (second) return <EmployeeRequestDetailPage />;
    return <EmployeeDashboard />;
  }

  if (first === 'schedule') return <EmployeeSchedulePage />;
  if (first === 'availability') return <EmployeeAvailabilityPage />;
  if (first === 'notifications') return <EmployeeNotificationsPage />;
  if (first === 'search') return <EmployeeSearchPage />;

  return <EmployeeDashboard />;
};

// ─────────────────────────────────────────────────────────────────────────────
const AdminPortalRouter = ({ sub }: { sub: string[] }) => {
  const [first, second] = sub;

  if (!first) return <AdminDashboard />;

  if (first === 'families') {
    if (second) return <FamilyDetailPage />;
    return <FamiliesPage />;
  }

  if (first === 'providers') {
    if (second) return <ProviderDetailPage />;
    return <ProvidersPage />;
  }

  if (first === 'employees') return <ProvidersPage />;

  if (first === 'requests') return <AdminCareRequestsPage />;

  if (first === 'emergency') {
    if (second) return <EmergencyDetailPage />;
    return <EmergencyCenterPage />;
  }

  if (first === 'notifications') return <AdminNotificationsPage />;
  if (first === 'categories') return <ServiceCategoriesPage />;
  if (first === 'timeline') return <PlatformTimelinePage />;
  if (first === 'settings') return <AdminSettingsPage />;

  return <AdminDashboard />;
};

export default PortalRouter;
