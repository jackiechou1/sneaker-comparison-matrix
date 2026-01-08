import { useState, useMemo } from "react";
import { 
  ArrowUpDown, 
  Search, 
  Filter, 
  Info, 
  TrendingUp, 
  DollarSign, 
  Activity,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  CheckSquare,
  Square
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CompareModal } from "@/components/CompareModal";
import sneakersData from "../data/sneakers.json";

// Types
type Sneaker = typeof sneakersData[0];
type SortKey = keyof Sneaker;
type SortOrder = "asc" | "desc";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ 
    key: "premium", 
    order: "desc" 
  });
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);

  // Extract unique brands
  const brands = useMemo(() => {
    const uniqueBrands = new Set(sneakersData.map(s => s.brand));
    return Array.from(uniqueBrands).sort();
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...sneakersData];

    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.model.toLowerCase().includes(lowerTerm) || 
        item.brand.toLowerCase().includes(lowerTerm) ||
        item.style.toLowerCase().includes(lowerTerm)
      );
    }

    // Brand Filter
    if (brandFilter && brandFilter !== "all") {
      data = data.filter(item => item.brand === brandFilter);
    }

    // Sort
    data.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.order === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.order === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return data;
  }, [searchTerm, brandFilter, sortConfig]);

  // Handle sort
  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      order: current.key === key && current.order === "desc" ? "asc" : "desc"
    }));
  };

  // Handle compare selection
  const toggleCompareSelection = (id: number) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i !== id));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const removeFromCompare = (id: number) => {
    setSelectedForCompare(selectedForCompare.filter(i => i !== id));
  };

  // Get sort icon
  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return sortConfig.order === "asc" 
      ? <ChevronUp className="ml-2 h-4 w-4 text-primary" /> 
      : <ChevronDown className="ml-2 h-4 w-4 text-primary" />;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  // Get premium color
  const getPremiumColor = (premium: number) => {
    if (premium >= 20) return "text-green-600 font-bold";
    if (premium > 0) return "text-green-500";
    if (premium === 0) return "text-gray-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="border-b-2 border-border bg-background sticky top-0 z-10">
        <div className="container py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 font-mono font-bold text-xl">
              SM-50
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tight">Sneaker Matrix</h1>
              <p className="text-xs text-muted-foreground font-mono">Consumer Footwear Analysis Database</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="SEARCH MODEL / STYLE..." 
                className="pl-8 font-mono text-sm border-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-full sm:w-40 border-2 border-border rounded-none font-mono text-sm focus:ring-0">
                <SelectValue placeholder="FILTER BRAND" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-border">
                <SelectItem value="all">ALL BRANDS</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Compare Bar */}
      {selectedForCompare.length > 0 && (
        <div className="border-b-2 border-border bg-accent/30 border-t-2">
          <div className="container py-3 flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="font-mono text-sm font-bold">
                {selectedForCompare.length} SELECTED FOR COMPARISON
              </span>
            </div>
            <div className="flex gap-2">
              {selectedForCompare.length >= 2 && (
                <Button
                  onClick={() => setCompareMode(true)}
                  className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold"
                >
                  COMPARE NOW ({selectedForCompare.length})
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setSelectedForCompare([])}
                className="rounded-none border-2 border-border font-mono text-xs font-bold hover:bg-destructive/10"
              >
                CLEAR
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container py-6 overflow-x-auto">
        <div className="border-2 border-border bg-card shadow-hard">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b-2 border-border">
                <TableHead className="w-[40px] font-bold text-foreground border-r border-border/50 text-center">
                  <span className="text-xs">SEL</span>
                </TableHead>
                <TableHead className="w-[50px] font-bold text-foreground border-r border-border/50">#</TableHead>
                <TableHead 
                  className="w-[200px] font-bold text-foreground cursor-pointer hover:bg-accent/50 border-r border-border/50"
                  onClick={() => handleSort("model")}
                >
                  <div className="flex items-center">MODEL {getSortIcon("model")}</div>
                </TableHead>
                <TableHead 
                  className="w-[120px] font-bold text-foreground cursor-pointer hover:bg-accent/50 border-r border-border/50"
                  onClick={() => handleSort("brand")}
                >
                  <div className="flex items-center">BRAND {getSortIcon("brand")}</div>
                </TableHead>
                <TableHead 
                  className="w-[100px] font-bold text-foreground cursor-pointer hover:bg-accent/50 border-r border-border/50 text-right"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center justify-end">MSRP {getSortIcon("price")}</div>
                </TableHead>
                <TableHead 
                  className="w-[100px] font-bold text-foreground cursor-pointer hover:bg-accent/50 border-r border-border/50 text-right"
                  onClick={() => handleSort("resalePrice")}
                >
                  <div className="flex items-center justify-end">RESALE {getSortIcon("resalePrice")}</div>
                </TableHead>
                <TableHead 
                  className="w-[100px] font-bold text-foreground cursor-pointer hover:bg-accent/50 border-r border-border/50 text-right"
                  onClick={() => handleSort("premium")}
                >
                  <div className="flex items-center justify-end">PREMIUM {getSortIcon("premium")}</div>
                </TableHead>
                <TableHead 
                  className="w-[150px] font-bold text-foreground cursor-pointer hover:bg-accent/50 border-r border-border/50"
                  onClick={() => handleSort("use")}
                >
                  <div className="flex items-center">PRIMARY USE {getSortIcon("use")}</div>
                </TableHead>
                <TableHead className="w-[80px] font-bold text-foreground text-center">
                  DETAILS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((sneaker, index) => {
                const isSelected = selectedForCompare.includes(sneaker.id);
                return (
                  <TableRow 
                    key={sneaker.id} 
                    className={`border-b border-border/50 font-mono text-sm group transition-colors ${
                      isSelected ? 'bg-accent/20 hover:bg-accent/30' : 'hover:bg-accent/20'
                    }`}
                  >
                    <TableCell className="text-center border-r border-border/50">
                      <button
                        onClick={() => toggleCompareSelection(sneaker.id)}
                        className="inline-flex items-center justify-center h-5 w-5 rounded-none hover:bg-primary/20 transition-colors"
                        disabled={!isSelected && selectedForCompare.length >= 3}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium border-r border-border/50 text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </TableCell>
                    <TableCell className="font-bold border-r border-border/50 group-hover:text-primary transition-colors">
                      {sneaker.model}
                    </TableCell>
                    <TableCell className="border-r border-border/50">
                      <Badge variant="outline" className="rounded-none border-foreground/30 font-normal text-xs">
                        {sneaker.brand.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right border-r border-border/50">
                      {formatCurrency(sneaker.price)}
                    </TableCell>
                    <TableCell className="text-right border-r border-border/50">
                      {formatCurrency(sneaker.resalePrice)}
                    </TableCell>
                    <TableCell className={`text-right border-r border-border/50 ${getPremiumColor(sneaker.premium)}`}>
                      {sneaker.premium > 0 ? '+' : ''}{sneaker.premium}%
                    </TableCell>
                    <TableCell className="border-r border-border/50 text-xs truncate max-w-[150px]">
                      {sneaker.use}
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none hover:bg-primary hover:text-primary-foreground"
                            onClick={() => setSelectedSneaker(sneaker)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-none border-2 border-border shadow-hard bg-card p-0 overflow-hidden">
                          <DialogHeader className="p-6 bg-muted/30 border-b-2 border-border">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge className="mb-2 rounded-none bg-primary hover:bg-primary text-primary-foreground border-none">
                                  {sneaker.brand.toUpperCase()}
                                </Badge>
                                <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
                                  {sneaker.model}
                                </DialogTitle>
                                <DialogDescription className="font-mono mt-1 text-foreground/70">
                                  {sneaker.style} • {sneaker.gender}
                                </DialogDescription>
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-bold font-mono text-primary">
                                  {formatCurrency(sneaker.price)}
                                </div>
                                <div className="text-xs font-mono text-muted-foreground">MSRP</div>
                              </div>
                            </div>
                          </DialogHeader>
                          
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Market Performance</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-accent/30 p-3 border border-border/20">
                                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3" /> Resale Avg
                                    </div>
                                    <div className="font-mono font-bold text-lg">{formatCurrency(sneaker.resalePrice)}</div>
                                  </div>
                                  <div className="bg-accent/30 p-3 border border-border/20">
                                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                      <Activity className="h-3 w-3" /> Premium
                                    </div>
                                    <div className={`font-mono font-bold text-lg ${getPremiumColor(sneaker.premium)}`}>
                                      {sneaker.premium > 0 ? '+' : ''}{sneaker.premium}%
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs font-mono text-muted-foreground">
                                  Market Range: {sneaker.priceRange} • Demand: <span className="text-foreground font-bold">{sneaker.demand}</span>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Target Audience</h4>
                                <div className="space-y-2 font-mono text-sm">
                                  <div className="flex justify-between border-b border-border/10 pb-1">
                                    <span>Age Group</span>
                                    <span className="font-bold">{sneaker.ageGroup}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-border/10 pb-1">
                                    <span>Activity Level</span>
                                    <span className="font-bold">{sneaker.activityLevel}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-border/10 pb-1">
                                    <span>Status</span>
                                    <span className="font-bold">{sneaker.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Technical Specs</h4>
                                <div className="bg-muted/10 p-4 border border-border/20 font-mono text-sm leading-relaxed">
                                  <p className="mb-2"><span className="font-bold">Cushioning:</span> {sneaker.cushioning}</p>
                                  <p className="mb-2"><span className="font-bold">Features:</span> {sneaker.techFeatures}</p>
                                  <p><span className="font-bold">Primary Use:</span> {sneaker.use}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Design & Aesthetics</h4>
                                <div className="space-y-2 font-mono text-sm">
                                  <p><span className="text-muted-foreground">Style:</span> {sneaker.style}</p>
                                  <p><span className="text-muted-foreground">Popular Colorways:</span> {sneaker.colorways}</p>
                                  <p><span className="text-muted-foreground">Collaboration:</span> {sneaker.collaboration}</p>
                                </div>
                              </div>
                              
                              <div className="pt-2 border-t border-border/20">
                                <div className="flex justify-between items-center text-xs font-mono">
                                  <span className="text-muted-foreground">Est. Annual Sales</span>
                                  <span className="font-bold text-primary">{sneaker.sales}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-xs font-mono text-muted-foreground">
          <div>
            SHOWING {filteredData.length} OF {sneakersData.length} MODELS
          </div>
          <div>
            DATA SOURCE: MARKET ANALYSIS 2025-2026
          </div>
        </div>
      </main>

      {/* Compare Modal */}
      <CompareModal
        open={compareMode}
        onOpenChange={setCompareMode}
        selectedIds={selectedForCompare}
        onRemove={removeFromCompare}
      />
    </div>
  );
}
