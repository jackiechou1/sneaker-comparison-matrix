import { useState, useEffect, useMemo } from "react";

const RANKINGS_STORAGE_KEY = "sneaker-matrix-rankings";

export interface SneakerRanking {
  id: number;
  favoriteCount: number;
  compareCount: number;
  viewCount: number;
  totalScore: number;
  lastUpdated: number;
}

export interface RankedSneaker extends SneakerRanking {
  rank: number;
  trend: "up" | "down" | "stable";
}

/**
 * 管理社区排行榜数据
 * 基于用户的收藏、对比和查看次数计算热度排名
 */
export function useCommunityRankings(totalSneakers: number) {
  const [rankings, setRankings] = useState<Record<number, SneakerRanking>>({});

  // 初始化排行榜数据
  useEffect(() => {
    const stored = localStorage.getItem(RANKINGS_STORAGE_KEY);
    if (stored) {
      try {
        setRankings(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse rankings from localStorage:", error);
        initializeRankings();
      }
    } else {
      initializeRankings();
    }
  }, []);

  // 初始化所有鞋款的排行榜数据
  const initializeRankings = () => {
    const newRankings: Record<number, SneakerRanking> = {};
    for (let i = 1; i <= totalSneakers; i++) {
      newRankings[i] = {
        id: i,
        favoriteCount: Math.floor(Math.random() * 100),
        compareCount: Math.floor(Math.random() * 50),
        viewCount: Math.floor(Math.random() * 500),
        totalScore: 0,
        lastUpdated: Date.now(),
      };
    }
    setRankings(newRankings);
  };

  // 记录收藏操作
  const recordFavorite = (id: number, isFavorite: boolean) => {
    setRankings((prev) => {
      const updated = { ...prev };
      if (!updated[id]) {
        updated[id] = {
          id,
          favoriteCount: 0,
          compareCount: 0,
          viewCount: 0,
          totalScore: 0,
          lastUpdated: Date.now(),
        };
      }
      updated[id].favoriteCount += isFavorite ? 1 : -1;
      updated[id].lastUpdated = Date.now();
      return updated;
    });
  };

  // 记录对比操作
  const recordCompare = (ids: number[]) => {
    setRankings((prev) => {
      const updated = { ...prev };
      ids.forEach((id) => {
        if (!updated[id]) {
          updated[id] = {
            id,
            favoriteCount: 0,
            compareCount: 0,
            viewCount: 0,
            totalScore: 0,
            lastUpdated: Date.now(),
          };
        }
        updated[id].compareCount += 1;
        updated[id].lastUpdated = Date.now();
      });
      return updated;
    });
  };

  // 记录查看操作
  const recordView = (id: number) => {
    setRankings((prev) => {
      const updated = { ...prev };
      if (!updated[id]) {
        updated[id] = {
          id,
          favoriteCount: 0,
          compareCount: 0,
          viewCount: 0,
          totalScore: 0,
          lastUpdated: Date.now(),
        };
      }
      updated[id].viewCount += 1;
      updated[id].lastUpdated = Date.now();
      return updated;
    });
  };

  // 计算热度排名
  const calculateRankings = useMemo(() => {
    const rankingsWithScores = Object.values(rankings).map((ranking) => {
      // 权重计算：收藏 (40%) + 对比 (35%) + 查看 (25%)
      const totalScore =
        ranking.favoriteCount * 40 +
        ranking.compareCount * 35 +
        ranking.viewCount * 25;

      return {
        ...ranking,
        totalScore,
      };
    });

    // 按总分排序
    rankingsWithScores.sort((a, b) => b.totalScore - a.totalScore);

    // 添加排名和趋势
    return rankingsWithScores.map((ranking, index) => {
      const trend = calculateTrend(ranking.id, rankings);
      return {
        ...ranking,
        rank: index + 1,
        trend: trend as "up" | "down" | "stable",
      };
    });
  }, [rankings]);

  // 计算趋势（简化版：基于最近活动）
  const calculateTrend = (id: number, currentRankings: Record<number, SneakerRanking>): "up" | "down" | "stable" => {
    const ranking = currentRankings[id];
    if (!ranking) return "stable";

    const recentActivity = ranking.favoriteCount + ranking.compareCount;
    if (recentActivity > 50) return "up";
    if (recentActivity < 10) return "down";
    return "stable";
  };

  // 保存排行榜到localStorage
  useEffect(() => {
    localStorage.setItem(RANKINGS_STORAGE_KEY, JSON.stringify(rankings));
  }, [rankings]);

  // 获取前N名排行榜
  const getTopRankings = (limit: number = 10) => {
    return calculateRankings.slice(0, limit);
  };

  // 获取特定鞋款的排名
  const getSneakerRanking = (id: number) => {
    return calculateRankings.find((r) => r.id === id);
  };

  return {
    rankings: calculateRankings as Array<SneakerRanking & { rank: number; trend: "up" | "down" | "stable" }>,
    recordFavorite,
    recordCompare,
    recordView,
    getTopRankings,
    getSneakerRanking,
  };
}
