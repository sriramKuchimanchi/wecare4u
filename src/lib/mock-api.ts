/**
 * Mock API utilities.
 * Simulates network latency and occasional failures so the data layer
 * behaves like a real backend while services are mocked.
 */
import type { ApiError, ApiResult } from '@/types';

const DEFAULT_LATENCY = 400;
const FAILURE_RATE = 0;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const jitter = (base: number) => Math.round(base * (0.5 + Math.random()));

const shouldFail = () => FAILURE_RATE > 0 && Math.random() < FAILURE_RATE;

const errorResponse = (code: string, message: string, details?: Record<string, unknown>): ApiError => ({
  code,
  message,
  details,
});

export async function mockRequest<T>(
  payload: T,
  options: { latency?: number; failRate?: number; errorCode?: string; errorMessage?: string } = {},
): Promise<ApiResult<T>> {
  const latency = options.latency ?? DEFAULT_LATENCY;
  const failRate = options.failRate ?? FAILURE_RATE;
  const willFail = (failRate > 0 && Math.random() < failRate) || shouldFail();

  await wait(jitter(latency));

  if (willFail) {
    return {
      success: false,
      error: errorResponse(
        options.errorCode ?? 'MOCK_ERROR',
        options.errorMessage ?? 'Mock request failed',
      ),
    };
  }

  return { success: true, data: payload };
}

export async function mockListRequest<T>(
  items: T[],
  options: { latency?: number; page?: number; pageSize?: number } = {},
): Promise<ApiResult<{ data: T[]; total: number; page: number; pageSize: number; totalPages: number }>> {
  const { latency = DEFAULT_LATENCY, page = 1, pageSize = 20 } = options;
  await wait(jitter(latency));

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return {
    success: true,
    data: { data, total, page, pageSize, totalPages },
  };
}

export const unwrap = <T>(result: ApiResult<T>): T => {
  if (!result.success || result.data === undefined) {
    throw new Error(result.error?.message ?? 'Unknown error');
  }
  return result.data;
};

export const createId = (prefix = 'id'): string =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;

export const nowISO = (): string => new Date().toISOString();
