import { useState } from "react";
import { 
  X, 
  TrendingUp, 
  Activity, 
  DollarSign,
  CheckCircle2,
  Circle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceChart } from "./PriceChart";
import sneakersData from "../data/sneakers.json";

type Sneaker = typeof sneakersData[0];

interface CompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: number[];
  onRemove: (id: number) => void;
}

export function CompareModal({ 
  open, 
  onOpenChange, 
  selectedIds, 
  onRemove 
}: CompareModalProps) {
  const selectedSneakers = sneakersData.filter(s => selectedIds.includes(s.id));

  if (selectedSneakers.length === 0) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const getPremiumColor = (premium: number) => {
    if (premium >= 20) return "text-green-600";
    if (premium > 0) return "text-green-500";
    if (premium === 0) return "text-gray-500";
    return "text-red-500";
  };

  const getComparisonWinner = (values: number[], isHigherBetter: boolean = true) => {
    const maxIdx = values.indexOf(Math.max(...values));
    const minIdx = values.indexOf(Math.min(...values));
    return isHigherBetter ? maxIdx : minIdx;
  };

  // Comparison sections
  const priceValues = selectedSneakers.map(s => s.price);
  const priceWinner = getComparisonWinner(priceValues, false); // Lower is better

  const resaleValues = selectedSneakers.map(s => s.resalePrice);
  const resaleWinner = getComparisonWinner(resaleValues, true);

  const premiumValues = selectedSneakers.map(s => s.premium);
  const premiumWinner = getComparisonWinner(premiumValues, true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl rounded-none border-2 border-border shadow-hard bg-card p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 bg-muted/30 border-b-2 border-border sticky top-0 z-10">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
              COMPARISON MATRIX
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none hover:bg-primary hover:text-primary-foreground"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-2">
            DETAILED SIDE-BY-SIDE ANALYSIS OF {selectedSneakers.length} MODELS
          </p>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Model Headers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedSneakers.map((sneaker, idx) => (
              <div key={sneaker.id} className="border-2 border-border bg-white p-4 relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-none opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-opacity"
                  onClick={() => onRemove(sneaker.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                <div className="pr-6">
                  <Badge className="mb-2 rounded-none bg-primary hover:bg-primary text-primary-foreground border-none">
                    {sneaker.brand.toUpperCase()}
                  </Badge>
                  <h3 className="text-lg font-bold uppercase tracking-tight mb-1">
                    {sneaker.model}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mb-3">
                    {sneaker.style}
                  </p>
                  
                  <div className="bg-accent/30 p-3 border border-border/20 mb-3">
                    <div className="text-xs text-muted-foreground mb-1">MSRP</div>
                    <div className="text-xl font-bold font-mono text-primary">
                      {formatCurrency(sneaker.price)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="border border-border/20 p-2">
                      <div className="text-muted-foreground mb-1">Status</div>
                      <div className="font-bold text-xs truncate">{sneaker.status}</div>
                    </div>
                    <div className="border border-border/20 p-2">
                      <div className="text-muted-foreground mb-1">Demand</div>
                      <div className="font-bold text-xs truncate">{sneaker.demand}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Comparison */}
          <div className="border-2 border-border bg-muted/10 p-6">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> PRICING ANALYSIS
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedSneakers.map((sneaker, idx) => (
                <div 
                  key={sneaker.id}
                  className={`p-4 border-2 ${idx === priceWinner ? 'border-secondary bg-secondary/5' : 'border-border/30'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">MSRP</div>
                      <div className="text-2xl font-bold font-mono">
                        {formatCurrency(sneaker.price)}
                      </div>
                    </div>
                    {idx === priceWinner && (
                      <Badge className="rounded-none bg-secondary hover:bg-secondary text-secondary-foreground border-none text-xs">
                        BEST VALUE
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-muted-foreground mb-1">Resale Avg</div>
                      <div className="font-bold">{formatCurrency(sneaker.resalePrice)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Price Range</div>
                      <div className="font-bold text-xs">{sneaker.priceRange}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resale Market */}
          <div className="border-2 border-border bg-muted/10 p-6">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> RESALE MARKET PERFORMANCE
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedSneakers.map((sneaker, idx) => (
                <div 
                  key={sneaker.id}
                  className={`p-4 border-2 ${idx === resaleWinner ? 'border-secondary bg-secondary/5' : 'border-border/30'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">AVG RESALE PRICE</div>
                      <div className="text-2xl font-bold font-mono">
                        {formatCurrency(sneaker.resalePrice)}
                      </div>
                    </div>
                    {idx === resaleWinner && (
                      <Badge className="rounded-none bg-secondary hover:bg-secondary text-secondary-foreground border-none text-xs">
                        HIGHEST VALUE
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-muted-foreground mb-1">Premium %</div>
                      <div className={`font-bold text-lg ${getPremiumColor(sneaker.premium)}`}>
                        {sneaker.premium > 0 ? '+' : ''}{sneaker.premium}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Demand</div>
                      <div className="font-bold">{sneaker.demand}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Analysis */}
          <div className="border-2 border-border bg-muted/10 p-6">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4" /> INVESTMENT POTENTIAL
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedSneakers.map((sneaker, idx) => {
                const isHighPremium = sneaker.premium >= 20;
                const isNegative = sneaker.premium < 0;
                return (
                  <div 
                    key={sneaker.id}
                    className={`p-4 border-2 ${idx === premiumWinner ? 'border-secondary bg-secondary/5' : 'border-border/30'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">PREMIUM PERCENTAGE</div>
                        <div className={`text-3xl font-bold font-mono ${getPremiumColor(sneaker.premium)}`}>
                          {sneaker.premium > 0 ? '+' : ''}{sneaker.premium}%
                        </div>
                      </div>
                      {idx === premiumWinner && (
                        <Badge className="rounded-none bg-secondary hover:bg-secondary text-secondary-foreground border-none text-xs">
                          BEST PREMIUM
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground">Retail Price</span>
                        <span className="font-bold">{formatCurrency(sneaker.price)}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground">Resale Avg</span>
                        <span className="font-bold">{formatCurrency(sneaker.resalePrice)}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-muted-foreground">Potential Gain</span>
                        <span className={`font-bold ${sneaker.premium > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(sneaker.resalePrice - sneaker.price)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-accent/20 border border-border/20">
                      <div className="text-xs font-bold uppercase">
                        {isHighPremium ? '🔥 High Demand' : isNegative ? '📉 Depreciation' : '➡️ Stable'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specifications */}
          <div className="border-2 border-border bg-muted/10 p-6">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-4">TECHNICAL SPECIFICATIONS</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedSneakers.map((sneaker) => (
                  <div key={sneaker.id} className="border border-border/30 p-4 space-y-3 text-xs font-mono">
                    <div>
                      <div className="text-muted-foreground mb-1">PRIMARY USE</div>
                      <div className="font-bold">{sneaker.use}</div>
                    </div>
                    <div className="border-t border-border/20 pt-3">
                      <div className="text-muted-foreground mb-1">CUSHIONING</div>
                      <div className="font-bold">{sneaker.cushioning}</div>
                    </div>
                    <div className="border-t border-border/20 pt-3">
                      <div className="text-muted-foreground mb-1">FEATURES</div>
                      <div className="font-bold text-xs leading-relaxed">{sneaker.techFeatures}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="border-2 border-border bg-muted/10 p-6">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-4">TARGET AUDIENCE & MARKET</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedSneakers.map((sneaker) => (
                  <div key={sneaker.id} className="border border-border/30 p-4 space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Gender</span>
                      <span className="font-bold">{sneaker.gender}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Age Group</span>
                      <span className="font-bold">{sneaker.ageGroup}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Activity Level</span>
                      <span className="font-bold">{sneaker.activityLevel}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Style</span>
                      <span className="font-bold text-xs">{sneaker.style}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Est. Sales</span>
                      <span className="font-bold">{sneaker.sales}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Design & Collaboration */}
          <div className="border-2 border-border bg-muted/10 p-6">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-4">DESIGN & COLLABORATION</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedSneakers.map((sneaker) => (
                <div key={sneaker.id} className="border border-border/30 p-4 space-y-3 text-xs font-mono">
                  <div>
                    <div className="text-muted-foreground mb-1">COLORWAYS</div>
                    <div className="font-bold">{sneaker.colorways}</div>
                  </div>
                  <div className="border-t border-border/20 pt-3">
                    <div className="text-muted-foreground mb-1">COLLABORATION</div>
                    <div className="font-bold">{sneaker.collaboration}</div>
                  </div>
                  <div className="border-t border-border/20 pt-3">
                    <div className="text-muted-foreground mb-1">PRODUCT STATUS</div>
                    <div className="font-bold text-xs">{sneaker.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price History Charts */}
          <div className="border-2 border-border bg-muted/10 p-6">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> PRICE HISTORY & MARKET TRENDS
            </h4>
            <div className="space-y-8">
              {selectedSneakers.map((sneaker) => (
                <PriceChart
                  key={sneaker.id}
                  modelId={sneaker.id}
                  modelName={sneaker.model}
                  msrp={sneaker.price}
                  resalePrice={sneaker.resalePrice}
                  premium={sneaker.premium}
                  demand={sneaker.demand}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
