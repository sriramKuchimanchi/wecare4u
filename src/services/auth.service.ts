import type {
  ApiResult, AuthSession, User, UserRole, OtpChannel, ProviderRegistrationType,
  ProfessionalCategory, OrganizationType, GovernmentIdType, VerificationStatus,
} from '@/types';
import { mockRequest, unwrap, createId, nowISO } from '@/lib/mock-api';
import { mockUsers } from '@/utils/mock-data';

const token = (userId: string) => `mock_token_${userId}_${Date.now()}`;
const refreshToken = (userId: string) => `mock_refresh_${userId}_${Date.now()}`;
const expiresAt = () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

const findUser = (email: string, role?: UserRole): User | undefined =>
  mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role));

const findUserByPhone = (phone: string, role?: UserRole): User | undefined =>
  mockUsers.find((u) => u.phone.replace(/\s/g, '') === phone.replace(/\s/g, '') && (!role || u.role === role));

const findEmployee = (identifier: string): User | undefined =>
  mockUsers.find((u) => u.role === 'employee' && (u.email.toLowerCase() === identifier.toLowerCase() || u.id === identifier));

const buildSession = (user: User, opts: { remember?: boolean; verification?: VerificationStatus; onboarding?: boolean } = {}): AuthSession => ({
  user: { ...user, lastLoginAt: nowISO() },
  token: token(user.id),
  refreshToken: refreshToken(user.id),
  expiresAt: expiresAt(),
  permissions: defaultPermissions(user.role),
  verificationStatus: opts.verification ?? 'verified',
  onboardingCompleted: opts.onboarding ?? true,
  rememberMe: opts.remember ?? false,
});

const defaultPermissions = (role: UserRole): string[] => {
  switch (role) {
    case 'family': return ['family:read', 'family:write', 'booking:read', 'booking:write', 'emergency:create'];
    case 'care-provider': return ['provider:read', 'provider:write', 'booking:read', 'booking:write'];
    case 'employee': return ['employee:read', 'booking:read', 'booking:write'];
    case 'admin': return ['admin:all'];
  }
};

const ADMIN_EMAIL = 'admin@lomaa.com';
const ADMIN_PASSWORD = 'lomaa123';

export const authService = {
  async login(email: string, _password: string, remember = false): Promise<ApiResult<AuthSession>> {
    const user = findUser(email) ?? mockUsers.find((u) => u.role === 'family')!;
    return mockRequest(buildSession(user, { remember, verification: 'verified', onboarding: true }));
  },

  async loginProvider(email: string, _password: string, remember = false): Promise<ApiResult<AuthSession>> {
    const user = findUser(email, 'care-provider') ?? mockUsers.find((u) => u.role === 'care-provider')!;
    return mockRequest(buildSession(user, { remember, verification: 'verified', onboarding: true }));
  },

  async loginEmployee(identifier: string, _password: string, remember = false): Promise<ApiResult<AuthSession>> {
    const user = findEmployee(identifier) ?? mockUsers.find((u) => u.role === 'employee')!;
    return mockRequest(buildSession(user, { remember, verification: 'verified', onboarding: true }));
  },

  async loginAdmin(email: string, password: string, remember = false): Promise<ApiResult<AuthSession>> {
    const user = mockUsers.find((u) => u.role === 'admin')!;
    return mockRequest(buildSession(user, { remember, verification: 'verified', onboarding: true }));
  },

  async sendOtp(channel: OtpChannel, target: string): Promise<ApiResult<{ sent: true; expiresInSeconds: number }>> {
    return mockRequest({ sent: true as const, expiresInSeconds: 60 }, { latency: 300 });
  },

  async verifyOtp(target: string, _otp: string, remember = false): Promise<ApiResult<AuthSession>> {
    const user = findUserByPhone(target, 'family') ?? findUser(target, 'family') ?? mockUsers.find((u) => u.role === 'family')!;
    return mockRequest(buildSession(user, { remember, verification: 'verified', onboarding: true }));
  },

  async registerFamily(input: {
    name: string; email: string; phone: string;
    familyName: string; address: string; state: string; district: string; city: string; pincode: string; emergencyContact: string;
    member?: {
      name: string; relationship: string; gender: string; dob: string; bloodGroup: string;
      medicalConditions?: string; allergies?: string; insuranceProvider?: string; emergencyContact?: string;
      governmentIdType?: GovernmentIdType; governmentIdNumber?: string;
    };
  }): Promise<ApiResult<AuthSession>> {
    const user: User = {
      id: createId('user'),
      name: input.name || 'Aisha Rahman',
      email: input.email || 'aisha.family@example.com',
      phone: input.phone || '+971 50 123 4567',
      role: 'family',
      isActive: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    return mockRequest(buildSession(user, { remember: true, verification: 'verified', onboarding: true }));
  },

  async registerProvider(input: {
    type: ProviderRegistrationType;
    category?: ProfessionalCategory;
    organizationType?: OrganizationType;
    name: string; email: string; phone: string; address: string;
    city?: string; district?: string; state?: string; pincode?: string;
    experience?: string; licenseNumber?: string; registrationNumber?: string; gst?: string; website?: string;
    primaryContactPerson?: string;
  }): Promise<ApiResult<{ submitted: true; status: 'pending'; referenceId: string }>> {
    return mockRequest({ submitted: true as const, status: 'pending' as const, referenceId: createId('PRV') }, { latency: 400 });
  },

  async forgotPassword(email: string): Promise<ApiResult<{ sent: true }>> {
    return mockRequest({ sent: true as const }, { latency: 300 });
  },

  async resetPassword(_token: string, _password: string): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 300 });
  },

  async logout(): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 150 });
  },

  async validateSession(token: string): Promise<ApiResult<User>> {
    const userId = token.replace('mock_token_', '').split('_')[0];
    const user = mockUsers.find((u) => u.id === userId) ?? mockUsers[0];
    return mockRequest(user, { latency: 200 });
  },

  async completeOnboarding(): Promise<ApiResult<{ ok: true }>> {
    return mockRequest({ ok: true as const }, { latency: 200 });
  },

  unwrap,
};

export default authService;
