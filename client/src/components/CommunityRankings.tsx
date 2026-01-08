import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Zap,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import sneakersData from "../data/sneakers.json";

type Sneaker = typeof sneakersData[0];

interface RankingData {
  id: number;
  rank: number;
  favoriteCount: number;
  compareCount: number;
  viewCount: number;
  totalScore: number;
  trend: "up" | "down" | "stable";
}

interface CommunityRankingsProps {
  rankings: RankingData[];
}

export function CommunityRankings({ rankings }: CommunityRankingsProps) {
  const topRankings = useMemo(() => rankings.slice(0, 10), [rankings]);

  const chartData = useMemo(() => {
    return topRankings.map((ranking) => {
      const sneaker = sneakersData.find((s) => s.id === ranking.id);
      return {
        name: sneaker?.model.substring(0, 15) || `Model ${ranking.id}`,
        favorites: ranking.favoriteCount,
        compares: ranking.compareCount,
        views: ranking.viewCount,
        score: Math.round(ranking.totalScore / 100),
      };
    });
  }, [topRankings]);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-700 border-gray-300";
      case 3:
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-blue-50 text-blue-700 border-blue-300";
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-2 border-border bg-muted/10 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-6 w-6 text-secondary" />
          <h2 className="text-xl font-bold uppercase tracking-tight">
            Community Rankings
          </h2>
        </div>
        <p className="text-sm font-mono text-muted-foreground">
          Real-time popularity rankings based on user favorites, comparisons, and views
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-2 border-border bg-muted/30">
          <TabsTrigger value="table" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            TABLE VIEW
          </TabsTrigger>
          <TabsTrigger value="chart" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            SCORE CHART
          </TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            METRICS
          </TabsTrigger>
        </TabsList>

        {/* Table View */}
        <TabsContent value="table" className="space-y-4">
          <div className="border-2 border-border bg-card overflow-hidden">
            <div className="grid grid-cols-12 gap-0 bg-muted/30 border-b-2 border-border p-4 font-bold text-xs uppercase">
              <div className="col-span-1 text-center">RANK</div>
              <div className="col-span-4">MODEL</div>
              <div className="col-span-2 text-center">FAVORITES</div>
              <div className="col-span-2 text-center">COMPARES</div>
              <div className="col-span-2 text-center">TREND</div>
              <div className="col-span-1 text-center">SCORE</div>
            </div>

            <div className="divide-y divide-border">
              {topRankings.map((ranking) => {
                const sneaker = sneakersData.find((s) => s.id === ranking.id);
                return (
                  <div
                    key={ranking.id}
                    className={`grid grid-cols-12 gap-0 p-4 items-center text-sm font-mono transition-colors hover:bg-accent/20 ${
                      ranking.rank <= 3 ? "bg-accent/10" : ""
                    }`}
                  >
                    <div className="col-span-1 text-center">
                      <Badge
                        className={`rounded-none border-2 font-bold text-sm w-full justify-center ${getMedalColor(
                          ranking.rank
                        )}`}
                      >
                        {getRankBadge(ranking.rank)}
                      </Badge>
                    </div>
                    <div className="col-span-4">
                      <div className="font-bold text-foreground">
                        {sneaker?.model}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sneaker?.brand}
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-3 w-3 text-secondary" />
                        <span className="font-bold">{ranking.favoriteCount}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-3 w-3 text-primary" />
                        <span className="font-bold">{ranking.compareCount}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(ranking.trend)}
                        <span className="text-xs uppercase font-bold">
                          {ranking.trend}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="font-bold text-primary">
                        {Math.round(ranking.totalScore / 100)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Chart View */}
        <TabsContent value="chart" className="space-y-4">
          <div className="border-2 border-border bg-card p-6">
            <h3 className="text-sm font-bold uppercase mb-4">
              Top 10 Sneakers by Popularity Score
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "2px solid #1a1a1a",
                    borderRadius: "0px",
                    fontFamily: "JetBrains Mono",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#1a1a1a", fontWeight: "bold" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
                />
                <Bar dataKey="score" fill="#3b82f6" name="Total Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Metrics View */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Favorites */}
            <div className="border-2 border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-secondary" />
                <h3 className="text-sm font-bold uppercase">Total Favorites</h3>
              </div>
              <div className="text-3xl font-bold font-mono text-secondary mb-2">
                {topRankings.reduce((sum, r) => sum + r.favoriteCount, 0)}
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                Across top 10 sneakers
              </p>
            </div>

            {/* Total Comparisons */}
            <div className="border-2 border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold uppercase">Total Comparisons</h3>
              </div>
              <div className="text-3xl font-bold font-mono text-primary mb-2">
                {topRankings.reduce((sum, r) => sum + r.compareCount, 0)}
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                Across top 10 sneakers
              </p>
            </div>

            {/* Average Views */}
            <div className="border-2 border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-accent" />
                <h3 className="text-sm font-bold uppercase">Avg Views/Model</h3>
              </div>
              <div className="text-3xl font-bold font-mono text-accent mb-2">
                {Math.round(
                  topRankings.reduce((sum, r) => sum + r.viewCount, 0) / 10
                )}
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                Top 10 average engagement
              </p>
            </div>
          </div>

          {/* Activity Distribution */}
          <div className="border-2 border-border bg-card p-6">
            <h3 className="text-sm font-bold uppercase mb-4">
              Activity Distribution (Top 10)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "2px solid #1a1a1a",
                    borderRadius: "0px",
                    fontFamily: "JetBrains Mono",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#1a1a1a", fontWeight: "bold" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
                />
                <Line
                  type="monotone"
                  dataKey="favorites"
                  stroke="#ec4899"
                  name="Favorites"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="compares"
                  stroke="#3b82f6"
                  name="Comparisons"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#8b5cf6"
                  name="Views"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <div className="border-2 border-border bg-muted/10 p-4">
        <h4 className="text-xs font-bold uppercase mb-3">Ranking Calculation</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-muted-foreground">Favorites:</span>
            <span className="font-bold ml-2">40% weight</span>
          </div>
          <div>
            <span className="text-muted-foreground">Comparisons:</span>
            <span className="font-bold ml-2">35% weight</span>
          </div>
          <div>
            <span className="text-muted-foreground">Views:</span>
            <span className="font-bold ml-2">25% weight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
