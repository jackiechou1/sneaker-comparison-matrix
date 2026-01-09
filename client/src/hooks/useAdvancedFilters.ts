import { useState, useMemo, useCallback } from "react";
import sneakersData from "../data/sneakers.json";

type Sneaker = typeof sneakersData[0];

export interface FilterOptions {
  priceRange: [number, number];
  premiumRange: [number, number];
  uses: string[];
  brands: string[];
  styles: string[];
  demandLevels: string[];
  genders: string[];
  status: string[];
}

const DEFAULT_FILTERS: FilterOptions = {
  priceRange: [0, 300],
  premiumRange: [-50, 100],
  uses: [],
  brands: [],
  styles: [],
  demandLevels: [],
  genders: [],
  status: [],
};

/**
 * 高级筛选Hook
 */
export function useAdvancedFilters() {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  // 获取所有可用的筛选选项
  const filterOptions = useMemo(() => {
    const uses = Array.from(new Set(sneakersData.map((s) => s.use)));
    const brands = Array.from(new Set(sneakersData.map((s) => s.brand)));
    const styles = Array.from(new Set(sneakersData.map((s) => s.style)));
    const demandLevels = Array.from(new Set(sneakersData.map((s) => s.demand)));
    const genders = Array.from(new Set(sneakersData.map((s) => s.gender)));
    const statuses = Array.from(new Set(sneakersData.map((s) => s.status)));

    return {
      uses: uses.sort(),
      brands: brands.sort(),
      styles: styles.sort(),
      demandLevels: demandLevels.sort(),
      genders: genders.sort(),
      statuses: statuses.sort(),
    };
  }, []);

  // 应用筛选
  const filteredSneakers = useMemo(() => {
    return sneakersData.filter((sneaker) => {
      // 价格范围筛选
      if (
        sneaker.price < filters.priceRange[0] ||
        sneaker.price > filters.priceRange[1]
      ) {
        return false;
      }

      // 溢价率筛选
      if (
        sneaker.premium < filters.premiumRange[0] ||
        sneaker.premium > filters.premiumRange[1]
      ) {
        return false;
      }

      // 用途筛选
      if (filters.uses.length > 0 && !filters.uses.includes(sneaker.use)) {
        return false;
      }

      // 品牌筛选
      if (
        filters.brands.length > 0 &&
        !filters.brands.includes(sneaker.brand)
      ) {
        return false;
      }

      // 风格筛选
      if (
        filters.styles.length > 0 &&
        !filters.styles.includes(sneaker.style)
      ) {
        return false;
      }

      // 需求等级筛选
      if (
        filters.demandLevels.length > 0 &&
        !filters.demandLevels.includes(sneaker.demand)
      ) {
        return false;
      }

      // 性别筛选
      if (
        filters.genders.length > 0 &&
        !filters.genders.includes(sneaker.gender)
      ) {
        return false;
      }

      // 状态筛选
      if (
        filters.status.length > 0 &&
        !filters.status.includes(sneaker.status)
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // 更新价格范围
  const setPriceRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  }, []);

  // 更新溢价率范围
  const setPremiumRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, premiumRange: range }));
  }, []);

  // 切换用途筛选
  const toggleUse = useCallback((use: string) => {
    setFilters((prev) => ({
      ...prev,
      uses: prev.uses.includes(use)
        ? prev.uses.filter((u) => u !== use)
        : [...prev.uses, use],
    }));
  }, []);

  // 切换品牌筛选
  const toggleBrand = useCallback((brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  }, []);

  // 切换风格筛选
  const toggleStyle = useCallback((style: string) => {
    setFilters((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  }, []);

  // 切换需求等级筛选
  const toggleDemandLevel = useCallback((demand: string) => {
    setFilters((prev) => ({
      ...prev,
      demandLevels: prev.demandLevels.includes(demand)
        ? prev.demandLevels.filter((d) => d !== demand)
        : [...prev.demandLevels, demand],
    }));
  }, []);

  // 切换性别筛选
  const toggleGender = useCallback((gender: string) => {
    setFilters((prev) => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter((g) => g !== gender)
        : [...prev.genders, gender],
    }));
  }, []);

  // 切换状态筛选
  const toggleStatus = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  }, []);

  // 重置筛选
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // 检查是否有活跃的筛选
  const hasActiveFilters = useMemo(() => {
    return (
      filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
      filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1] ||
      filters.premiumRange[0] !== DEFAULT_FILTERS.premiumRange[0] ||
      filters.premiumRange[1] !== DEFAULT_FILTERS.premiumRange[1] ||
      filters.uses.length > 0 ||
      filters.brands.length > 0 ||
      filters.styles.length > 0 ||
      filters.demandLevels.length > 0 ||
      filters.genders.length > 0 ||
      filters.status.length > 0
    );
  }, [filters]);

  return {
    filters,
    filteredSneakers,
    filterOptions,
    setPriceRange,
    setPremiumRange,
    toggleUse,
    toggleBrand,
    toggleStyle,
    toggleDemandLevel,
    toggleGender,
    toggleStatus,
    resetFilters,
    hasActiveFilters,
  };
}
