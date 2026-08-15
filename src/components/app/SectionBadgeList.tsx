import type { WorkSection } from "@/data/types";
import { Badge } from "@/components/ui/badge";

interface SectionBadgeListProps {
  sectionIds: string[];
  allSections: WorkSection[];
}

export function SectionBadgeList({ sectionIds, allSections }: SectionBadgeListProps) {
  const sections = sectionIds
    .map((id) => allSections.find((s) => s.id === id))
    .filter((s): s is WorkSection => !!s);

  return (
    <div className="flex flex-wrap gap-1.5">
      {sections.map((s) => (
        <Badge key={s.id} variant="secondary" className="w-fit">
          {s.title}
        </Badge>
      ))}
    </div>
  );
}
