import { useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CommunityRankings } from "@/components/CommunityRankings";
import { RankingsShare } from "@/components/RankingsShare";
import { useCommunityRankings } from "@/hooks/useCommunityRankings";
import sneakersData from "../data/sneakers.json";

export default function Rankings() {
  const [, setLocation] = useLocation();
  const { rankings } = useCommunityRankings(sneakersData.length);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="border-b-2 border-border bg-background sticky top-0 z-10">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none hover:bg-accent"
            onClick={() => setLocation("/")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">
              Community Rankings
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Real-time popularity analysis
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="mb-6 flex justify-end">
          <RankingsShare rankings={rankings} />
        </div>
        <CommunityRankings rankings={rankings} />
      </main>
    </div>
  );
}
