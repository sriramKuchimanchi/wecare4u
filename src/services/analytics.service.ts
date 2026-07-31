import type { ApiResult } from '@/types';
import { mockRequest, unwrap } from '@/lib/mock-api';

type AnalyticsBucket = {
  label: string;
  value: number;
};

export const analyticsService = {
  async bookingsOverTime(): Promise<ApiResult<AnalyticsBucket[]>> {
    return mockRequest([
      { label: 'Mon', value: 12 },
      { label: 'Tue', value: 18 },
      { label: 'Wed', value: 15 },
      { label: 'Thu', value: 22 },
      { label: 'Fri', value: 28 },
      { label: 'Sat', value: 19 },
      { label: 'Sun', value: 11 },
    ], { latency: 500 });
  },
  async providerMix(): Promise<ApiResult<AnalyticsBucket[]>> {
    return mockRequest([
      { label: 'Home Care', value: 45 },
      { label: 'Nursing', value: 25 },
      { label: 'Pharmacy', value: 15 },
      { label: 'Lab', value: 10 },
      { label: 'Transport', value: 5 },
    ], { latency: 500 });
  },
  unwrap,
};
