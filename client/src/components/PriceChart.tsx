import { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generatePriceHistory, getPriceStats } from "../data/priceHistory";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceChartProps {
  modelId: number;
  modelName: string;
  msrp: number;
  resalePrice: number;
  premium: number;
  demand: string;
}

export function PriceChart({
  modelId,
  modelName,
  msrp,
  resalePrice,
  premium,
  demand,
}: PriceChartProps) {
  const priceHistory = useMemo(
    () => generatePriceHistory(modelId, msrp, resalePrice, premium, demand),
    [modelId, msrp, resalePrice, premium, demand]
  );

  const stats = useMemo(() => getPriceStats(priceHistory), [priceHistory]);

  const chartData = useMemo(
    () =>
      priceHistory.map((point) => ({
        ...point,
        msrp: msrp,
      })),
    [priceHistory, msrp]
  );

  const getTrendIcon = () => {
    if (premium > 10) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (premium < -5) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getPriceColor = () => {
    if (premium > 20) return "#22c55e"; // green-500
    if (premium > 10) return "#84cc16"; // lime-500
    if (premium > 0) return "#06b6d4"; // cyan-500
    if (premium === 0) return "#6b7280"; // gray-500
    return "#ef4444"; // red-500
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h5 className="text-sm font-bold uppercase tracking-tight mb-1">
            {modelName}
          </h5>
          <p className="text-xs font-mono text-muted-foreground">
            12-MONTH RESALE PRICE PROJECTION
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <Badge
            className={`rounded-none border-none font-mono text-xs ${
              premium > 20
                ? "bg-green-100 text-green-700"
                : premium > 10
                  ? "bg-lime-100 text-lime-700"
                  : premium > 0
                    ? "bg-cyan-100 text-cyan-700"
                    : premium === 0
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-700"
            }`}
          >
            {premium > 0 ? "+" : ""}
            {premium}% PREMIUM
          </Badge>
        </div>
      </div>

      {/* Chart */}
      <div className="border border-border/30 bg-white p-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorResale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getPriceColor()} stopOpacity={0.3} />
                <stop offset="95%" stopColor={getPriceColor()} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMsrp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "2px solid #1a1a1a",
                borderRadius: "0px",
                fontFamily: "JetBrains Mono",
                fontSize: "12px",
              }}
              formatter={(value) => `$${value}`}
              labelStyle={{ color: "#1a1a1a", fontWeight: "bold" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}
              iconType="line"
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={getPriceColor()}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorResale)"
              name="Resale Price"
            />
            <Line
              type="monotone"
              dataKey="msrp"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="MSRP (Reference)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border/30 p-3 bg-muted/10">
          <div className="text-xs text-muted-foreground mb-1 font-mono">MIN PRICE</div>
          <div className="text-lg font-bold font-mono text-primary">
            ${stats.minPrice}
          </div>
        </div>
        <div className="border border-border/30 p-3 bg-muted/10">
          <div className="text-xs text-muted-foreground mb-1 font-mono">MAX PRICE</div>
          <div className="text-lg font-bold font-mono text-secondary">
            ${stats.maxPrice}
          </div>
        </div>
        <div className="border border-border/30 p-3 bg-muted/10">
          <div className="text-xs text-muted-foreground mb-1 font-mono">AVG PRICE</div>
          <div className="text-lg font-bold font-mono">${stats.avgPrice}</div>
        </div>
        <div className="border border-border/30 p-3 bg-muted/10">
          <div className="text-xs text-muted-foreground mb-1 font-mono">VOLATILITY</div>
          <div className="text-lg font-bold font-mono">{stats.volatility}%</div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-accent/20 border border-border/30 p-3">
        <div className="text-xs font-mono space-y-1">
          <div className="font-bold text-foreground">MARKET INSIGHTS</div>
          <div className="text-muted-foreground">
            {premium > 20 ? (
              <span>
                🔥 <span className="font-bold">High Demand:</span> This model shows strong resale value with
                consistent price appreciation. Excellent investment potential.
              </span>
            ) : premium > 10 ? (
              <span>
                📈 <span className="font-bold">Positive Trend:</span> Moderate resale demand with steady price
                growth. Good for collectors.
              </span>
            ) : premium > 0 ? (
              <span>
                ➡️ <span className="font-bold">Stable Market:</span> Slight resale premium. Maintains value
                reasonably well.
              </span>
            ) : premium === 0 ? (
              <span>
                ⚖️ <span className="font-bold">Neutral:</span> Resale price tracks MSRP closely. Limited
                investment upside.
              </span>
            ) : (
              <span>
                📉 <span className="font-bold">Depreciation:</span> Resale value below retail. Consider for
                personal use only.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
