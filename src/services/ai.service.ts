import type { ApiResult } from '@/types';
import { mockRequest, unwrap } from '@/lib/mock-api';

/**
 * AI service placeholder.
 * Future prompts will wire this to a real AI provider via edge functions.
 */
export const aiService = {
  async suggestCare(input: { familyMemberId: string; symptoms: string[] }): Promise<ApiResult<{ suggestion: string; confidence: number }>> {
    return mockRequest({
      suggestion: 'Based on the provided information, a home-care visit within 24 hours is recommended. This is a placeholder suggestion.',
      confidence: 0.62,
    }, { latency: 600 });
  },
  async summarizeTimeline(familyId: string): Promise<ApiResult<{ summary: string }>> {
    return mockRequest({
      summary: `Placeholder summary for family ${familyId}. Recent activity indicates routine care is on track.`,
    }, { latency: 500 });
  },
  unwrap,
};
