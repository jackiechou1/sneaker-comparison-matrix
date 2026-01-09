import { useCallback } from "react";
import { toast } from "sonner";

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * 分享功能Hook
 */
export function useShare() {
  /**
   * 生成对比链接
   */
  const generateCompareLink = useCallback((sneakerIds: number[]) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    params.set("compare", sneakerIds.join(","));
    return `${baseUrl}/?${params.toString()}`;
  }, []);

  /**
   * 生成排行榜链接
   */
  const generateRankingsLink = useCallback(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/rankings`;
  }, []);

  /**
   * 复制到剪贴板
   */
  const copyToClipboard = useCallback(async (text: string, label: string = "Link") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`, {
        description: "Ready to share with your friends",
      });
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy link");
      return false;
    }
  }, []);

  /**
   * 使用Web Share API分享
   */
  const shareViaWebShare = useCallback(
    async (data: ShareData) => {
      if (!navigator.share) {
        // 如果不支持Web Share API，复制到剪贴板
        return copyToClipboard(data.url, data.title);
      }

      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url,
        });
        return true;
      } catch (error: any) {
        // 用户取消分享不算错误
        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
          toast.error("Failed to share");
        }
        return false;
      }
    },
    [copyToClipboard]
  );

  /**
   * 分享到Twitter
   */
  const shareToTwitter = useCallback((text: string, url: string) => {
    const twitterUrl = new URL("https://twitter.com/intent/tweet");
    twitterUrl.searchParams.set("text", text);
    twitterUrl.searchParams.set("url", url);
    window.open(twitterUrl.toString(), "_blank", "width=550,height=420");
  }, []);

  /**
   * 分享到Facebook
   */
  const shareToFacebook = useCallback((url: string) => {
    const facebookUrl = new URL("https://www.facebook.com/sharer/sharer.php");
    facebookUrl.searchParams.set("u", url);
    window.open(facebookUrl.toString(), "_blank", "width=550,height=420");
  }, []);

  /**
   * 分享到LinkedIn
   */
  const shareToLinkedIn = useCallback((url: string, title: string) => {
    const linkedInUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");
    linkedInUrl.searchParams.set("url", url);
    window.open(linkedInUrl.toString(), "_blank", "width=550,height=420");
  }, []);

  /**
   * 分享到Reddit
   */
  const shareToReddit = useCallback((url: string, title: string) => {
    const redditUrl = new URL("https://reddit.com/submit");
    redditUrl.searchParams.set("url", url);
    redditUrl.searchParams.set("title", title);
    window.open(redditUrl.toString(), "_blank", "width=550,height=420");
  }, []);

  /**
   * 生成对比报告文本
   */
  const generateCompareReport = useCallback(
    (sneakers: any[], title: string = "Sneaker Comparison") => {
      let report = `${title}\n`;
      report += `Generated: ${new Date().toLocaleDateString()}\n`;
      report += "=".repeat(50) + "\n\n";

      sneakers.forEach((sneaker, index) => {
        report += `${index + 1}. ${sneaker.model}\n`;
        report += `   Brand: ${sneaker.brand}\n`;
        report += `   MSRP: $${sneaker.price.toFixed(2)}\n`;
        report += `   Resale: $${sneaker.resalePrice.toFixed(2)}\n`;
        report += `   Premium: ${sneaker.premium > 0 ? "+" : ""}${sneaker.premium}%\n`;
        report += `   Use: ${sneaker.use}\n`;
        report += `   Style: ${sneaker.style}\n`;
        report += "\n";
      });

      report += "=".repeat(50) + "\n";
      report += "Share this comparison with your friends!\n";

      return report;
    },
    []
  );

  /**
   * 生成排行榜报告文本
   */
  const generateRankingsReport = useCallback((rankings: any[]) => {
    let report = "🏆 Sneaker Community Rankings\n";
    report += `Generated: ${new Date().toLocaleDateString()}\n`;
    report += "=".repeat(50) + "\n\n";

    rankings.slice(0, 10).forEach((item, index) => {
      report += `${index + 1}. ${item.model} (${item.brand})\n`;
      report += `   Hotness Score: ${item.hotnessScore.toFixed(1)}\n`;
      report += `   Favorites: ${item.favorites}\n`;
      report += `   Comparisons: ${item.comparisons}\n`;
      report += "\n";
    });

    report += "=".repeat(50) + "\n";
    report += "Check out the full rankings!\n";

    return report;
  }, []);

  return {
    generateCompareLink,
    generateRankingsLink,
    copyToClipboard,
    shareViaWebShare,
    shareToTwitter,
    shareToFacebook,
    shareToLinkedIn,
    shareToReddit,
    generateCompareReport,
    generateRankingsReport,
  };
}
