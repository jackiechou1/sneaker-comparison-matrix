import { Heart, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FavoritesPanel } from "./FavoritesPanel";

interface FavoritesDialogProps {
  favorites: number[];
  onRemoveFavorite: (id: number) => void;
  onClearFavorites: () => void;
  onSelectForCompare?: (id: number) => void;
  selectedForCompare?: number[];
}

export function FavoritesDialog({
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onSelectForCompare,
  selectedForCompare,
}: FavoritesDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-none border-2 border-border hover:bg-secondary hover:text-secondary-foreground hover:border-secondary relative"
        >
          <Heart className="h-4 w-4" />
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-none border-2 border-border shadow-hard bg-card p-0 overflow-hidden h-[80vh] flex flex-col">
        <DialogHeader className="p-4 bg-muted/30 border-b-2 border-border flex-shrink-0">
          <DialogTitle className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
            <Heart className="h-4 w-4 text-secondary" />
            MY FAVORITES
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <FavoritesPanel
            favorites={favorites}
            onRemoveFavorite={onRemoveFavorite}
            onClearFavorites={onClearFavorites}
            onSelectForCompare={onSelectForCompare}
            selectedForCompare={selectedForCompare}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
