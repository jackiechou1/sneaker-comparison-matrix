import { useState, useEffect, useMemo } from "react";

const REVIEWS_STORAGE_KEY = "sneaker-matrix-reviews";

export interface Review {
  id: string;
  sneakerId: number;
  author: string;
  rating: number; // 1-5
  title: string;
  content: string;
  aspects: {
    comfort: number; // 1-5
    durability: number; // 1-5
    style: number; // 1-5
    value: number; // 1-5
  };
  createdAt: number;
  helpful: number; // 点赞数
}

/**
 * 管理用户评论和评分
 */
export function useReviews(sneakerId: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从localStorage加载评论
  useEffect(() => {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (stored) {
      try {
        const allReviews = JSON.parse(stored);
        setReviews(allReviews.filter((r: Review) => r.sneakerId === sneakerId));
      } catch (error) {
        console.error("Failed to parse reviews from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, [sneakerId]);

  // 保存评论到localStorage
  const saveReviews = (updatedReviews: Review[]) => {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    let allReviews: Review[] = [];
    
    if (stored) {
      try {
        allReviews = JSON.parse(stored);
      } catch (error) {
        console.error("Failed to parse reviews from localStorage:", error);
      }
    }

    // 移除当前鞋款的旧评论，添加新评论
    allReviews = allReviews.filter((r: Review) => r.sneakerId !== sneakerId);
    allReviews = [...allReviews, ...updatedReviews];

    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews));
  };

  // 添加新评论
  const addReview = (review: Omit<Review, "id" | "createdAt" | "helpful">) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}-${Math.random()}`,
      createdAt: Date.now(),
      helpful: 0,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
    return newReview;
  };

  // 删除评论
  const deleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter((r) => r.id !== reviewId);
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
  };

  // 点赞评论
  const markHelpful = (reviewId: string) => {
    const updatedReviews = reviews.map((r) =>
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    );
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
  };

  // 计算平均评分
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // 计算各方面平均评分
  const averageAspects = useMemo(() => {
    if (reviews.length === 0) {
      return { comfort: 0, durability: 0, style: 0, value: 0 };
    }

    const aspects = { comfort: 0, durability: 0, style: 0, value: 0 };
    reviews.forEach((r) => {
      aspects.comfort += r.aspects.comfort;
      aspects.durability += r.aspects.durability;
      aspects.style += r.aspects.style;
      aspects.value += r.aspects.value;
    });

    return {
      comfort: (aspects.comfort / reviews.length).toFixed(1),
      durability: (aspects.durability / reviews.length).toFixed(1),
      style: (aspects.style / reviews.length).toFixed(1),
      value: (aspects.value / reviews.length).toFixed(1),
    };
  }, [reviews]);

  // 获取评分分布
  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating as keyof typeof distribution]++;
    });
    return distribution;
  }, [reviews]);

  // 按有用性排序评论
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => b.helpful - a.helpful);
  }, [reviews]);

  return {
    reviews: sortedReviews,
    addReview,
    deleteReview,
    markHelpful,
    averageRating,
    averageAspects,
    ratingDistribution,
    totalReviews: reviews.length,
    isLoaded,
  };
}
