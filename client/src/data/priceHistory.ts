/**
 * 生成运动鞋价格历史数据
 * 基于溢价率和市场需求生成模拟的12个月价格走势
 */

export interface PricePoint {
  month: string;
  price: number;
  trend: "up" | "down" | "stable";
}

export function generatePriceHistory(
  modelId: number,
  msrp: number,
  resalePrice: number,
  premium: number,
  demand: string
): PricePoint[] {
  // 基于需求等级确定波动幅度
  const volatilityMap: Record<string, number> = {
    "Very High": 0.15,
    "High": 0.12,
    "Moderate-High": 0.08,
    "Moderate": 0.05,
    "Low-Moderate": 0.03,
    "Low": 0.02,
  };

  const volatility = volatilityMap[demand] || 0.05;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // 基于溢价率确定价格趋势
  let basePrice = msrp;
  const priceHistory: PricePoint[] = [];

  // 如果溢价率高，价格应该上升；如果低或负，价格应该下降
  const trendDirection = premium > 10 ? 1 : premium < -5 ? -1 : 0;
  const trendStrength = Math.abs(premium) / 100;

  for (let i = 0; i < 12; i++) {
    // 添加随机波动
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    
    // 添加趋势
    const trendFactor = trendDirection * trendStrength * (i / 12);
    
    // 计算当月价格
    const monthlyChange = randomFactor + trendFactor;
    const monthPrice = basePrice * (1 + monthlyChange);
    
    // 确定趋势方向
    let trend: "up" | "down" | "stable";
    if (monthPrice > basePrice * 1.02) {
      trend = "up";
    } else if (monthPrice < basePrice * 0.98) {
      trend = "down";
    } else {
      trend = "stable";
    }

    priceHistory.push({
      month: months[i],
      price: Math.round(monthPrice),
      trend,
    });

    basePrice = monthPrice;
  }

  return priceHistory;
}

/**
 * 获取价格走势的统计信息
 */
export function getPriceStats(history: PricePoint[]) {
  const prices = history.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const volatility = Math.round(
    (Math.sqrt(
      prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length
    ) / avgPrice) * 100
  );

  return {
    minPrice,
    maxPrice,
    avgPrice,
    volatility,
    range: maxPrice - minPrice,
  };
}
