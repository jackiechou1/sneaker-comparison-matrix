import { Share2 } from "lucide-react";
import { ShareDialog } from "@/components/ShareDialog";
import { useShare } from "@/hooks/useShare";
import sneakersData from "../data/sneakers.json";

interface CompareShareProps {
  selectedIds: number[];
}

export function CompareShare({ selectedIds }: CompareShareProps) {
  const { generateCompareLink, generateCompareReport } = useShare();

  const selectedSneakers = sneakersData.filter((s) =>
    selectedIds.includes(s.id)
  );

  if (selectedSneakers.length === 0) {
    return null;
  }

  const link = generateCompareLink(selectedIds);
  const report = generateCompareReport(
    selectedSneakers,
    `Comparing ${selectedSneakers.length} Sneakers`
  );

  const title = `Sneaker Comparison: ${selectedSneakers
    .map((s) => s.model)
    .join(" vs ")}`;

  return (
    <ShareDialog
      title={title}
      text={report}
      url={link}
      triggerLabel="SHARE COMPARISON"
    />
  );
}
