import { useState } from "react";
import { ChevronDown, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { FilterOptions } from "@/hooks/useAdvancedFilters";

interface AdvancedFilterPanelProps {
  filters: FilterOptions;
  filterOptions: {
    uses: string[];
    brands: string[];
    styles: string[];
    demandLevels: string[];
    genders: string[];
    statuses: string[];
  };
  onPriceRangeChange: (range: [number, number]) => void;
  onPremiumRangeChange: (range: [number, number]) => void;
  onToggleUse: (use: string) => void;
  onToggleBrand: (brand: string) => void;
  onToggleStyle: (style: string) => void;
  onToggleDemandLevel: (demand: string) => void;
  onToggleGender: (gender: string) => void;
  onToggleStatus: (status: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
}

export function AdvancedFilterPanel({
  filters,
  filterOptions,
  onPriceRangeChange,
  onPremiumRangeChange,
  onToggleUse,
  onToggleBrand,
  onToggleStyle,
  onToggleDemandLevel,
  onToggleGender,
  onToggleStatus,
  onReset,
  hasActiveFilters,
  resultCount,
}: AdvancedFilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    premium: true,
    use: false,
    brand: false,
    style: false,
    demand: false,
    gender: false,
    status: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: string;
    children: React.ReactNode;
  }) => (
    <Collapsible
      open={openSections[section]}
      onOpenChange={() => toggleSection(section)}
      className="border-b border-border/30"
    >
      <CollapsibleTrigger asChild>
        <button className="w-full flex justify-between items-center py-3 px-4 hover:bg-muted/50 transition-colors">
          <span className="text-xs font-bold uppercase text-foreground">
            {title}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections[section] ? "rotate-180" : ""
            }`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 space-y-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="border-2 border-border bg-card rounded-none shadow-hard">
      {/* Header */}
      <div className="border-b-2 border-border p-4 bg-muted/30 flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase">Advanced Filters</h3>
        {hasActiveFilters && (
          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="rounded-none h-6 px-2 text-xs font-mono hover:bg-destructive/20 hover:text-destructive"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            RESET
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="divide-y divide-border/30">
        {/* Price Range */}
        <FilterSection title="Price Range (MSRP)" section="price">
          <div className="space-y-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) =>
                onPriceRangeChange([value[0], value[1]])
              }
              min={0}
              max={300}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </FilterSection>

        {/* Premium Range */}
        <FilterSection title="Premium Range (%)" section="premium">
          <div className="space-y-3">
            <Slider
              value={filters.premiumRange}
              onValueChange={(value) =>
                onPremiumRangeChange([value[0], value[1]])
              }
              min={-50}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>{filters.premiumRange[0]}%</span>
              <span>{filters.premiumRange[1]}%</span>
            </div>
          </div>
        </FilterSection>

        {/* Primary Use */}
        <FilterSection title="Primary Use" section="use">
          <div className="space-y-2">
            {filterOptions.uses.map((use) => (
              <label
                key={use}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none"
              >
                <Checkbox
                  checked={filters.uses.includes(use)}
                  onCheckedChange={() => onToggleUse(use)}
                  className="rounded-none"
                />
                <span className="text-xs font-mono text-foreground">
                  {use}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brand */}
        <FilterSection title="Brand" section="brand">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none"
              >
                <Checkbox
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => onToggleBrand(brand)}
                  className="rounded-none"
                />
                <span className="text-xs font-mono text-foreground">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Style */}
        <FilterSection title="Style" section="style">
          <div className="space-y-2">
            {filterOptions.styles.map((style) => (
              <label
                key={style}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none"
              >
                <Checkbox
                  checked={filters.styles.includes(style)}
                  onCheckedChange={() => onToggleStyle(style)}
                  className="rounded-none"
                />
                <span className="text-xs font-mono text-foreground">
                  {style}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Demand Level */}
        <FilterSection title="Demand Level" section="demand">
          <div className="space-y-2">
            {filterOptions.demandLevels.map((demand) => (
              <label
                key={demand}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none"
              >
                <Checkbox
                  checked={filters.demandLevels.includes(demand)}
                  onCheckedChange={() => onToggleDemandLevel(demand)}
                  className="rounded-none"
                />
                <span className="text-xs font-mono text-foreground">
                  {demand}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Gender */}
        <FilterSection title="Gender" section="gender">
          <div className="space-y-2">
            {filterOptions.genders.map((gender) => (
              <label
                key={gender}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none"
              >
                <Checkbox
                  checked={filters.genders.includes(gender)}
                  onCheckedChange={() => onToggleGender(gender)}
                  className="rounded-none"
                />
                <span className="text-xs font-mono text-foreground">
                  {gender}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Status */}
        <FilterSection title="Status" section="status">
          <div className="space-y-2">
            {filterOptions.statuses.map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none"
              >
                <Checkbox
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => onToggleStatus(status)}
                  className="rounded-none"
                />
                <span className="text-xs font-mono text-foreground">
                  {status}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-border p-4 bg-muted/20">
        <div className="text-xs font-mono text-muted-foreground text-center">
          {resultCount} sneaker{resultCount !== 1 ? "s" : ""} found
        </div>
      </div>
    </div>
  );
}
