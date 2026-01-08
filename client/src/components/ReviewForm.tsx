import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Review } from "@/hooks/useReviews";

interface ReviewFormProps {
  sneakerId: number;
  onSubmit: (review: Omit<Review, "id" | "createdAt" | "helpful">) => void;
}

export function ReviewForm({ sneakerId, onSubmit }: ReviewFormProps) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comfort, setComfort] = useState<number>(5);
  const [durability, setDurability] = useState<number>(5);
  const [style, setStyle] = useState<number>(5);
  const [value, setValue] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !title.trim() || !content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit({
        sneakerId,
        author: author.trim(),
        rating,
        title: title.trim(),
        content: content.trim(),
        aspects: {
          comfort,
          durability,
          style,
          value,
        },
      });

      // Reset form
      setAuthor("");
      setRating(5);
      setTitle("");
      setContent("");
      setComfort(5);
      setDurability(5);
      setStyle(5);
      setValue(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, onChange: (v: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-5 w-5 ${
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-border bg-muted/10 p-6 space-y-6">
      <div>
        <h4 className="text-sm font-bold uppercase mb-4">Share Your Experience</h4>
      </div>

      {/* Author */}
      <div>
        <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
          Your Name *
        </label>
        <Input
          type="text"
          placeholder="Enter your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="rounded-none border-2 border-border font-mono text-sm"
          required
        />
      </div>

      {/* Overall Rating */}
      <div>
        <label className="text-xs font-bold uppercase text-muted-foreground mb-3 block">
          Overall Rating *
        </label>
        <div className="flex items-center gap-4">
          {renderStars(rating, setRating)}
          <Badge className="rounded-none bg-primary text-primary-foreground border-none font-mono">
            {rating}/5
          </Badge>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
          Review Title *
        </label>
        <Input
          type="text"
          placeholder="e.g., Comfortable and stylish"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-none border-2 border-border font-mono text-sm"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
          Your Review *
        </label>
        <textarea
          placeholder="Share your experience wearing this sneaker..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-none border-2 border-border font-mono text-sm p-3 min-h-[120px] focus:outline-none focus:border-primary"
          required
        />
      </div>

      {/* Aspect Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-border pt-4">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
            Comfort
          </label>
          {renderStars(comfort, setComfort)}
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
            Durability
          </label>
          {renderStars(durability, setDurability)}
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
            Style
          </label>
          {renderStars(style, setStyle)}
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
            Value for Money
          </label>
          {renderStars(value, setValue)}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-none border-2 border-border bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold"
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
      </Button>
    </form>
  );
}
