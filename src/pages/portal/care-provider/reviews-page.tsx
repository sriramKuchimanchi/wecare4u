import { useState } from 'react';
import { icons } from '@/config/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProviderReviewsQuery, useRespondReviewMutation } from '@/hooks/use-portal-queries';

export const ReviewsPage = () => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const { data: reviews = [], isLoading, refetch } = useProviderReviewsQuery(sortBy);
  const respondMutation = useRespondReviewMutation();

  const handleSendResponse = async (reviewId: string) => {
    if (!responseText.trim()) return;
    try {
      await respondMutation.mutateAsync({ reviewId, responseText: responseText.trim() });
      toast({ title: 'Response Submitted', description: 'Your reply has been published.' });
      setReplyingReviewId(null);
      setResponseText('');
      refetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to submit response.', variant: 'destructive' });
    }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(2) : '4.88';

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Family Reviews & Feedback</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Read reviews left by families and send official provider responses</p>
        </div>

        {/* Filter Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
          className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="newest">Sort by Newest</option>
          <option value="highest">Sort by Highest Rated</option>
          <option value="lowest">Sort by Lowest Rated</option>
        </select>
      </div>

      {/* Rating Overview Card */}
      <div className="rounded-2xl bg-surface p-6 border border-border/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <span className="text-3xl font-black">{avgRating}</span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-secondary">
              {[...Array(5)].map((_, i) => (
                <icons.Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <h2 className="text-base font-bold text-foreground mt-1">Overall Satisfaction Score</h2>
            <p className="text-xs text-muted-foreground">{reviews.length} verified ratings submitted by families</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <span className="text-muted-foreground font-semibold">5 Stars</span>
            <p className="text-lg font-bold text-foreground">88%</p>
          </div>
          <div>
            <span className="text-muted-foreground font-semibold">4 Stars</span>
            <p className="text-lg font-bold text-foreground">12%</p>
          </div>
          <div>
            <span className="text-muted-foreground font-semibold">1-3 Stars</span>
            <p className="text-lg font-bold text-foreground">0%</p>
          </div>
        </div>
      </div>

      {/* Review List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="rounded-2xl bg-surface p-5 border border-border/60 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{rev.reviewerName}</h3>
                    <span className="text-2xs text-muted-foreground">({rev.patientName})</span>
                  </div>
                  <div className="flex items-center gap-1 text-secondary mt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <icons.Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <span className="text-2xs text-muted-foreground">{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border">
                "{rev.comment}"
              </p>

              {/* Provider Official Response */}
              {rev.response ? (
                <div className="rounded-xl bg-primary/5 p-3 text-xs border border-primary/20 space-y-1">
                  <span className="font-bold text-primary flex items-center gap-1 text-2xs uppercase">
                    <icons.MessageSquare className="h-3.5 w-3.5" /> Provider Official Response
                  </span>
                  <p className="text-foreground">{rev.response.text}</p>
                </div>
              ) : (
                <div>
                  {replyingReviewId === rev.id ? (
                    <div className="space-y-2 pt-2">
                      <Input
                        placeholder="Write official response to family..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="text-xs"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setReplyingReviewId(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSendResponse(rev.id)}>
                          Publish Response
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={() => setReplyingReviewId(rev.id)}>
                      <icons.MessageSquare className="h-3.5 w-3.5" /> Reply to Review
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
