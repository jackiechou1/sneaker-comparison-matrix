import { ShareDialog } from "@/components/ShareDialog";
import { useShare } from "@/hooks/useShare";

interface RankingsShareProps {
  rankings: any[];
}

export function RankingsShare({ rankings }: RankingsShareProps) {
  const { generateRankingsLink, generateRankingsReport } = useShare();

  const link = generateRankingsLink();
  const report = generateRankingsReport(rankings);
  const title = "🏆 Sneaker Community Rankings - Check out the most popular sneakers!";

  return (
    <ShareDialog
      title={title}
      text={report}
      url={link}
      triggerLabel="SHARE RANKINGS"
    />
  );
}
