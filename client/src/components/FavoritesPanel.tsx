import { Heart, X, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import sneakersData from "../data/sneakers.json";

type Sneaker = typeof sneakersData[0];

interface FavoritesPanelProps {
  favorites: number[];
  onRemoveFavorite: (id: number) => void;
  onClearFavorites: () => void;
  onSelectForCompare?: (id: number) => void;
  selectedForCompare?: number[];
}

export function FavoritesPanel({
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onSelectForCompare,
  selectedForCompare = [],
}: FavoritesPanelProps) {
  const favoriteItems = sneakersData.filter((s) => favorites.includes(s.id));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getPremiumColor = (premium: number) => {
    if (premium >= 20) return "text-green-600";
    if (premium > 0) return "text-green-500";
    if (premium === 0) return "text-gray-500";
    return "text-red-500";
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-sm font-bold uppercase mb-2">No Favorites Yet</h3>
        <p className="text-xs font-mono text-muted-foreground">
          Click the heart icon on any sneaker to save it here for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b-2 border-border p-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
            <Heart className="h-4 w-4 text-secondary" />
            FAVORITES
          </h2>
          <Badge variant="outline" className="rounded-none border-foreground/30 font-mono text-xs">
            {favorites.length}
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          {favorites.length} saved sneaker{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {favoriteItems.map((sneaker) => {
            const isSelected = selectedForCompare?.includes(sneaker.id);
            return (
              <div
                key={sneaker.id}
                className={`border-2 p-3 transition-colors ${
                  isSelected
                    ? "border-primary bg-accent/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold uppercase truncate mb-1">
                      {sneaker.model}
                    </h4>
                    <Badge
                      variant="outline"
                      className="rounded-none border-foreground/30 font-normal text-xs mb-2"
                    >
                      {sneaker.brand.toUpperCase()}
                    </Badge>
                  </div>
                  <button
                    onClick={() => onRemoveFavorite(sneaker.id)}
                    className="flex-shrink-0 ml-2 p-1 hover:bg-destructive/10 transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>

                <div className="space-y-1 mb-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MSRP</span>
                    <span className="font-bold">
                      {formatCurrency(sneaker.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resale</span>
                    <span className="font-bold">
                      {formatCurrency(sneaker.resalePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Premium</span>
                    <span className={`font-bold ${getPremiumColor(sneaker.premium)}`}>
                      {sneaker.premium > 0 ? "+" : ""}
                      {sneaker.premium}%
                    </span>
                  </div>
                </div>

                {onSelectForCompare && (
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="w-full rounded-none border-2 font-mono text-xs font-bold h-7"
                    onClick={() => onSelectForCompare(sneaker.id)}
                  >
                    {isSelected ? (
                      <>
                        <Zap className="h-3 w-3 mr-1" />
                        SELECTED
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-3 w-3 mr-1" />
                        SELECT
                      </>
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t-2 border-border p-4 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-none border-2 border-border font-mono text-xs font-bold hover:bg-destructive/10"
          onClick={onClearFavorites}
        >
          CLEAR ALL
        </Button>
      </div>
    </div>
  );
}
