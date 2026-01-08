import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RatingSummaryProps {
  averageRating: string | number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  averageAspects: {
    comfort: string | number;
    durability: string | number;
    style: string | number;
    value: string | number;
  };
}

export function RatingSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  averageAspects,
}: RatingSummaryProps) {
  const renderStars = (rating: number | string) => {
    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(numRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getMaxRating = () => {
    let max = 0;
    let maxRating = 5;
    Object.entries(ratingDistribution).forEach(([rating, count]) => {
      if (count > max) {
        max = count;
        maxRating = parseInt(rating);
      }
    });
    return maxRating;
  };

  return (
    <div className="border-2 border-border bg-muted/10 p-6 space-y-6">
      <div>
        <h4 className="text-sm font-bold uppercase mb-4">Rating Summary</h4>
      </div>

      {/* Overall Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="text-5xl font-bold font-mono text-primary">
            {averageRating}
          </div>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(averageRating)}
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage =
              totalReviews > 0
                ? Math.round((count / totalReviews) * 100)
                : 0;
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs font-mono w-8 text-right">
                  {rating}★
                </span>
                <div className="flex-1 h-2 bg-border rounded-none overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratings */}
      <div className="border-t-2 border-border pt-6">
        <h5 className="text-xs font-bold uppercase text-muted-foreground mb-4">
          Average Aspect Ratings
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Comfort", value: averageAspects.comfort },
            { label: "Durability", value: averageAspects.durability },
            { label: "Style", value: averageAspects.style },
            { label: "Value for Money", value: averageAspects.value },
          ].map((aspect) => (
            <div key={aspect.label} className="bg-card border border-border/20 p-3">
              <div className="text-xs font-mono text-muted-foreground mb-2">
                {aspect.label}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderStars(aspect.value)}
                </div>
                <Badge className="rounded-none bg-primary/10 text-primary border-none font-mono font-bold">
                  {aspect.value}/5
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      {totalReviews > 0 && (
        <div className="border-t-2 border-border pt-4">
          <div className="bg-accent/20 border border-border/30 p-3 rounded-none">
            <p className="text-xs font-mono text-foreground">
              {(typeof averageRating === "number" ? averageRating : parseFloat(String(averageRating))) >= 4
                ? "✅ Highly recommended by users"
                : (typeof averageRating === "number" ? averageRating : parseFloat(String(averageRating))) >= 3
                  ? "👍 Generally well-received"
                  : "⚠️ Mixed reviews - check details"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
