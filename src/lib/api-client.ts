/**
 * Thin API client abstraction.
 * Real HTTP calls will replace the mock dispatcher in future prompts,
 * without touching service-layer call sites.
 */
import type { ApiResult } from '@/types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type ApiClient = {
  request: <T>(path: string, options?: RequestOptions) => Promise<ApiResult<T>>;
};

const BASE_URL = '/api';

const buildHeaders = (headers?: Record<string, string>): Record<string, string> => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  ...headers,
});

export const apiClient: ApiClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: options.method ?? 'GET',
        headers: buildHeaders(options.headers),
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: options.signal,
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: errorPayload.message ?? response.statusText,
            details: errorPayload,
          },
        };
      }

      const data = (await response.json()) as T;
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err instanceof Error ? err.message : 'Network request failed',
        },
      };
    }
  },
};
