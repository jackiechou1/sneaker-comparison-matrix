import { Star, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Review } from "@/hooks/useReviews";

interface ReviewsListProps {
  reviews: Review[];
  onMarkHelpful: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
}

export function ReviewsList({
  reviews,
  onMarkHelpful,
  onDelete,
}: ReviewsListProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  if (reviews.length === 0) {
    return (
      <div className="border-2 border-border bg-muted/10 p-6 text-center">
        <p className="text-sm font-mono text-muted-foreground">
          No reviews yet. Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-2 border-border bg-card p-6 space-y-3 hover:border-primary/50 transition-colors"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge
                  className={`rounded-none border-none font-mono font-bold ${getRatingColor(
                    review.rating
                  )}`}
                >
                  {review.rating}/5
                </Badge>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <h5 className="text-sm font-bold uppercase mb-1">
                {review.title}
              </h5>
              <p className="text-xs font-mono text-muted-foreground">
                By <span className="font-bold">{review.author}</span> •{" "}
                {formatDate(review.createdAt)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(review.id)}
              className="rounded-none hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm font-mono text-foreground leading-relaxed">
            {review.content}
          </p>

          {/* Aspect Ratings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-border/20 pt-3">
            <div className="text-xs">
              <div className="text-muted-foreground mb-1">Comfort</div>
              <div className="flex items-center gap-1">
                {renderStars(review.aspects.comfort)}
                <span className="font-bold ml-1">{review.aspects.comfort}</span>
              </div>
            </div>
            <div className="text-xs">
              <div className="text-muted-foreground mb-1">Durability</div>
              <div className="flex items-center gap-1">
                {renderStars(review.aspects.durability)}
                <span className="font-bold ml-1">
                  {review.aspects.durability}
                </span>
              </div>
            </div>
            <div className="text-xs">
              <div className="text-muted-foreground mb-1">Style</div>
              <div className="flex items-center gap-1">
                {renderStars(review.aspects.style)}
                <span className="font-bold ml-1">{review.aspects.style}</span>
              </div>
            </div>
            <div className="text-xs">
              <div className="text-muted-foreground mb-1">Value</div>
              <div className="flex items-center gap-1">
                {renderStars(review.aspects.value)}
                <span className="font-bold ml-1">{review.aspects.value}</span>
              </div>
            </div>
          </div>

          {/* Helpful Button */}
          <div className="flex items-center gap-2 border-t border-border/20 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkHelpful(review.id)}
              className="rounded-none border-border font-mono text-xs hover:bg-primary/10"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Helpful ({review.helpful})
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
